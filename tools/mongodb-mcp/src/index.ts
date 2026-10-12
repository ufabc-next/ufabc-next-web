import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import mongoose from 'mongoose';
import { z } from 'zod';

const { MongoClient, BSON } = mongoose.mongo;

const MAX_DOCUMENTS = 200;
const QUERY_TIMEOUT_MS = 20_000;

// Write stages and server-side JavaScript: never allowed in read-only mode.
const FORBIDDEN_OPERATORS = new Set([
  '$out',
  '$merge',
  '$function',
  '$accumulator',
  '$where',
]);

export function isReadOnlyMode(env: NodeJS.ProcessEnv) {
  return env.MONGODB_MCP_READ_ONLY !== 'false';
}

export function capLimit(requestedLimit: number | undefined) {
  if (requestedLimit === undefined) {
    return MAX_DOCUMENTS;
  }
  return Math.min(requestedLimit, MAX_DOCUMENTS);
}

// Walks every nested object/array so stages inside $lookup, $facet and
// $unionWith sub-pipelines are checked too.
export function assertReadOnlyValue(value: unknown) {
  if (Array.isArray(value)) {
    for (const item of value) {
      assertReadOnlyValue(item);
    }
    return;
  }

  if (value === null || typeof value !== 'object') {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (FORBIDDEN_OPERATORS.has(key)) {
      throw new Error(`Operator ${key} is not allowed in read-only mode`);
    }
    assertReadOnlyValue(nestedValue);
  }
}

// Accepts Extended JSON so callers can pass {"$oid": "..."} or {"$date": "..."}.
function parseExtendedJson(value: unknown) {
  return BSON.EJSON.deserialize(JSON.parse(JSON.stringify(value)));
}

function toToolResult(payload: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: BSON.EJSON.stringify(payload, undefined, 2, { relaxed: true }),
      },
    ],
  };
}

function toToolError(error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    content: [{ type: 'text' as const, text: `Query failed: ${errorMessage}` }],
    isError: true,
  };
}

async function main() {
  if (!process.env.MONGODB_CONNECTION_URL) {
    try {
      loadEnvFile(new URL('../../../apps/core/.env', import.meta.url));
    } catch {
      // no local .env file, which is fine when MONGODB_CONNECTION_URL is set directly
    }
  }

  const connectionUrl = process.env.MONGODB_CONNECTION_URL;
  if (!connectionUrl) {
    throw new Error('MONGODB_CONNECTION_URL environment variable is required');
  }

  const readOnly = isReadOnlyMode(process.env);
  const client = new MongoClient(connectionUrl, {
    appName: 'next-mongodb-mcp',
    serverSelectionTimeoutMS: 15_000,
  });
  await client.connect();
  const database = client.db();

  const server = new McpServer({ name: 'mongodb-mcp', version: '0.1.0' });

  server.registerTool(
    'mongodb_list_collections',
    {
      description: 'List the collection names of the connected database.',
      inputSchema: {},
    },
    async () => {
      try {
        const collections = await database.listCollections().toArray();
        const names: string[] = [];
        for (const collection of collections) {
          names.push(collection.name);
        }
        return toToolResult(names);
      } catch (error) {
        return toToolError(error);
      }
    }
  );

  server.registerTool(
    'mongodb_find',
    {
      description: `Find documents in a collection (Extended JSON filter). Returns at most ${MAX_DOCUMENTS} documents.`,
      inputSchema: {
        collection: z.string().min(1),
        filter: z.record(z.unknown()).default({}),
        projection: z.record(z.unknown()).optional(),
        sort: z.record(z.unknown()).optional(),
        limit: z.number().int().positive().optional(),
      },
    },
    async ({ collection, filter, projection, sort, limit }) => {
      try {
        const parsedFilter = parseExtendedJson(filter);
        if (readOnly) {
          assertReadOnlyValue(parsedFilter);
        }

        let cursor = database
          .collection(collection)
          .find(parsedFilter, { maxTimeMS: QUERY_TIMEOUT_MS })
          .limit(capLimit(limit));

        if (projection) {
          cursor = cursor.project(parseExtendedJson(projection));
        }
        if (sort) {
          cursor = cursor.sort(parseExtendedJson(sort));
        }

        return toToolResult(await cursor.toArray());
      } catch (error) {
        return toToolError(error);
      }
    }
  );

  server.registerTool(
    'mongodb_aggregate',
    {
      description: `Run an aggregation pipeline (Extended JSON stages). Read-only unless MONGODB_MCP_READ_ONLY=false: $out, $merge, $function, $accumulator and $where are rejected. A $limit of ${MAX_DOCUMENTS} is appended.`,
      inputSchema: {
        collection: z.string().min(1),
        pipeline: z.array(z.record(z.unknown())),
      },
    },
    async ({ collection, pipeline }) => {
      try {
        const parsedPipeline = parseExtendedJson(pipeline);
        if (readOnly) {
          assertReadOnlyValue(parsedPipeline);
        }

        const cappedPipeline = [...parsedPipeline, { $limit: MAX_DOCUMENTS }];
        const documents = await database
          .collection(collection)
          .aggregate(cappedPipeline, { maxTimeMS: QUERY_TIMEOUT_MS })
          .toArray();

        return toToolResult(documents);
      } catch (error) {
        return toToolError(error);
      }
    }
  );

  server.registerTool(
    'mongodb_count',
    {
      description: 'Count documents matching a filter (Extended JSON).',
      inputSchema: {
        collection: z.string().min(1),
        filter: z.record(z.unknown()).default({}),
      },
    },
    async ({ collection, filter }) => {
      try {
        const parsedFilter = parseExtendedJson(filter);
        if (readOnly) {
          assertReadOnlyValue(parsedFilter);
        }

        const total = await database
          .collection(collection)
          .countDocuments(parsedFilter, { maxTimeMS: QUERY_TIMEOUT_MS });

        return toToolResult({ count: total });
      } catch (error) {
        return toToolError(error);
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

const isEntryPoint = process.argv[1] === fileURLToPath(import.meta.url);
if (isEntryPoint) {
  main().catch((error) => {
    process.stderr.write(`mongodb-mcp failed to start: ${error}\n`);
    process.exit(1);
  });
}

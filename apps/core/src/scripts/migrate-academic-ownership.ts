import { readFile } from 'node:fs/promises';

import mongoose from 'mongoose';

import { migrateAcademicOwnership } from '../services/academic-migration.js';

const file = process.argv[2];
const uri = process.env.MONGODB_CONNECTION_URL;
if (!file || !uri)
  throw new Error(
    'Supply a reviewed manifest path and MONGODB_CONNECTION_URL. Default: dry run; --apply writes.'
  );
try {
  await mongoose.connect(uri, { autoIndex: false });
  const result = await migrateAcademicOwnership(
    JSON.parse(await readFile(file, 'utf8')),
    process.argv.includes('--apply')
  );
  console.log(JSON.stringify(result)); // Counts and digest only; never student data.
} finally {
  await mongoose.disconnect();
}

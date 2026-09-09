# `Core`

## Services convention (new code only)

New route-backed services should be a class extending `BaseService`
(`src/services/base-service.ts`) instead of a file of exported functions.
This is **not** a retrofit — existing services (`routes/comments/service.ts`,
etc.) stay as-is; only apply this to services you're writing from scratch.

`BaseService` gives you `this.logger`, a child logger already tagged with
the service's class name and the current request's `traceId` (read from the
same `@fastify/request-context` store `tracing.ts` populates — no need to
thread it through manually). That's the actual point: it lets you follow
one request's logs across route → service → connector calls in Axiom by
`traceId`, which is what we were missing while investigating apps/core's
4xx/5xx errors.

Under the hood this is `getClassLogger(instance)` (`src/utils/logger.ts`) —
similar to Python's `getLogger(__name__)` or the JVM's
`LoggerFactory.getLogger(MyClass.class)`: every log line is tagged with the
concrete class that emitted it, inferred from `instance.constructor.name`
instead of a hardcoded string. `connectors/base-requester.ts` and
`connectors/base-aws-connector.ts` already use it too, so e.g. `SigaaConnector`
and `S3Connector` logs show up tagged by their own class name rather than a
generic `connector`/`aws` flag.

```ts
// src/services/some-feature-service.ts
import { BaseService, type BaseServiceOptions } from './base-service.js';

export class SomeFeatureService extends BaseService {
  constructor(options: BaseServiceOptions = {}) {
    super(options);
  }

  async doSomething(id: string) {
    this.logger.info({ id }, 'doing something');
    // ...
  }
}
```

```ts
// src/routes/some-feature/index.ts
app.post('/some-feature', async (request, reply) => {
  const service = new SomeFeatureService();
  return service.doSomething(request.body.id);
});
```

`traceId` is optional and resolved from the ambient request context
automatically (same `@fastify/request-context` AsyncLocalStorage store
`tracing.ts` populates), so route handlers don't need to pass it — only
supply it explicitly for background jobs or tests, where there's no request
in flight.

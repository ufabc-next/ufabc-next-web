import assert from 'node:assert/strict';
import { test } from 'node:test';

import { assertReadOnlyValue, capLimit, isReadOnlyMode } from '../src/index.ts';

test('isReadOnlyMode defaults to true and is false only when explicitly disabled', () => {
  assert.equal(isReadOnlyMode({}), true);
  assert.equal(isReadOnlyMode({ MONGODB_MCP_READ_ONLY: 'true' }), true);
  assert.equal(isReadOnlyMode({ MONGODB_MCP_READ_ONLY: 'false' }), false);
});

test('capLimit defaults to and never exceeds the maximum', () => {
  assert.equal(capLimit(undefined), 200);
  assert.equal(capLimit(5), 5);
  assert.equal(capLimit(100_000), 200);
});

test('assertReadOnlyValue accepts a plain read pipeline', () => {
  assert.doesNotThrow(() =>
    assertReadOnlyValue([
      { $match: { status: 'failed' } },
      { $group: { _id: '$status', total: { $sum: 1 } } },
    ])
  );
});

test('assertReadOnlyValue rejects write stages, including nested ones', () => {
  assert.throws(() => assertReadOnlyValue([{ $out: 'x' }]), /\$out/);
  assert.throws(
    () =>
      assertReadOnlyValue([
        { $lookup: { from: 'a', pipeline: [{ $merge: { into: 'b' } }], as: 'c' } },
      ]),
    /\$merge/
  );
  assert.throws(() => assertReadOnlyValue({ $where: 'sleep(1000)' }), /\$where/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      yield* walk(p);
    } else if (p.endsWith('.js') || p.endsWith('.mjs')) {
      yield p;
    }
  }
}

test('node --check passes for api/ and scripts/lib/', () => {
  const files = [...walk(join(process.cwd(), 'api')), ...walk(join(process.cwd(), 'scripts', 'lib'))];
  assert.ok(files.length > 0);
  for (const f of files) {
    execFileSync('node', ['--check', f], { stdio: 'ignore' });
  }
});

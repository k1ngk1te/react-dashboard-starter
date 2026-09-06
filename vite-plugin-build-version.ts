import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { Plugin, ResolvedConfig } from 'vite';

/**
 * Name of the static file dropped alongside index.html in the build output.
 * The runtime version check (`src/utils/build-version.ts`) fetches it.
 */
export const BUILD_VERSION_FILENAME = 'build-version.json';

/**
 * Vite plugin: on every production build, write `build-version.json` into the
 * resolved build output directory:
 *
 *   { "key": "<uuid>", "builtAt": "<ISO timestamp>" }
 *
 * A fresh random key is generated per build, so an already-open tab can notice
 * that a new bundle has been deployed by polling this file.
 */
export default function buildVersionPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'build-version',
    apply: 'build',
    configResolved(resolved) {
      config = resolved;
    },
    async closeBundle() {
      // `config.build.outDir` is relative to `config.root`, not `process.cwd()`.
      const outDir = path.resolve(config.root, config.build.outDir);
      const target = path.join(outDir, BUILD_VERSION_FILENAME);

      const payload = {
        key: randomUUID(),
        builtAt: new Date().toISOString(),
      };

      await mkdir(outDir, { recursive: true });
      await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');

      config.logger.info(`  ${BUILD_VERSION_FILENAME} written  key=${payload.key}`);
    },
  };
}

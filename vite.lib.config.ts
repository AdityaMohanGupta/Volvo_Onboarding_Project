import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// separate build config, only used by `npm run build:components` - the normal
// `npm run dev` / `npm run build` are untouched by this file and keep building
// the actual app from index.html as before.
//
// builds ONE component at a time (selected via the LIB_ENTRY env var) so each
// output file is fully self-contained - no shared chunk between the two, so a
// consumer wanting just one component never has to know a second file exists.
// each file bundles Lit itself too, so zero build tooling is needed to use it.
const entries = {
  'employee-form': resolve(import.meta.dirname, 'src/components/employee-form/employee-form.ts'),
  'employee-table': resolve(import.meta.dirname, 'src/components/employee-table/employee-table.ts'),
}

const entryName = process.env.LIB_ENTRY
if (!entryName || !(entryName in entries)) {
  throw new Error(`Set LIB_ENTRY to one of: ${Object.keys(entries).join(', ')}`)
}

export default defineConfig({
  build: {
    outDir: 'dist-components',
    emptyOutDir: false,
    lib: {
      entry: entries[entryName as keyof typeof entries],
      formats: ['es'],
      fileName: () => `${entryName}.js`,
    },
  },
})

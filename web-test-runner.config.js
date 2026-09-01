import { esbuildPlugin } from '@web/dev-server-esbuild'

// runs real Mocha (describe/it) + Chai (expect) tests inside an actual browser,
// which is what's needed here since these components render into Shadow DOM -
// plain Node-based Mocha has no DOM to render into at all
export default {
  files: 'test/**/*.test.ts',
  nodeResolve: true,
  // esbuildPlugin's default target is old browsers that can't downlevel object
  // rest/spread destructuring the way esbuild wants to - 'auto' isn't a target
  // this plugin understands (that's a Vite-only convention), so target a real
  // modern JS version directly instead of the ancient default.
  // tsconfig is passed explicitly so esbuild picks up useDefineForClassFields:
  // false from it - without that, es2022's native class field semantics clash
  // with Lit's @property()/@state() decorators ("Unsupported decorator location")
  plugins: [esbuildPlugin({ ts: true, target: 'es2022', tsconfig: 'tsconfig.json' })],
}

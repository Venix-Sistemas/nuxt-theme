// build.config.ts
// @nuxt/module-builder only copies `src/runtime/` verbatim into `dist/runtime/`.
// `src/runtime/**` files import from `../../app/**` (types, constants, utils, theme.json),
// so `src/app/` must also be copied (as a real mkdist entry, not rollup-bundled)
// or those imports resolve to a non-existent `dist/app/**` once published.
export default {
  // The `nuxt-module-builder:runtime-externals` plugin externalizes any import
  // matching a mkdist entry (now also `src/app/`), which makes unbuild's
  // dependency validator flag those local `dist/app/*.js` paths as "implicit
  // dependencies" (a false positive: they are internal, not npm packages).
  failOnWarn: false,
  entries: [
    {
      input: 'src/app/',
      outDir: 'dist/app',
      addRelativeDeclarationExtensions: true,
      ext: 'js',
      pattern: [
        '**',
        '!**/*.stories.{js,cts,mts,ts,jsx,tsx}',
        '!**/*.{spec,test}.{js,cts,mts,ts,jsx,tsx}',
      ],
    },
  ],
}

import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';

// Read package.json (since we're using ES modules)
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 */`;

export default [
  // ESM build for core API (for bundlers/advanced usage)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.core.esm.js',
      format: 'esm',
      banner,
      sourcemap: true
    },
    plugins: [typescript()]
  },
  
  // CommonJS build for core API (for Node.js/advanced usage)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.core.cjs.js',
      format: 'cjs',
      banner,
      sourcemap: true,
      exports: 'named',
    },
    plugins: [typescript()]
  },
  
  // Main UMD build (unminified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.js',
      format: 'umd',
      name: 'CustomViews',
      banner,
      sourcemap: true
    },
    plugins: [typescript()]
  },
  
  // Main UMD build (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.min.js',
      format: 'umd',
      name: 'CustomViews',
      banner,
      sourcemap: true
    },
    plugins: [typescript(), terser()]
  },
  
  // ESM build for browser module scripts
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.esm.js',
      format: 'esm',
      banner,
      sourcemap: true
    },
    plugins: [typescript()]
  }
];
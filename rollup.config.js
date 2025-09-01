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
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.esm.js',
      format: 'esm',
      banner,
    },
    plugins: [typescript()]
  },
  
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.cjs.js',
      format: 'cjs',
      banner,
      exports: 'named'
    },
    plugins: [typescript()]
  },
  
  // UMD build (unminified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.umd.js',
      format: 'umd',
      name: 'CustomViews',
      banner,
      exports: 'named'
    },
    plugins: [typescript()]
  },
  
  // UMD build (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/custom-views.umd.min.js',
      format: 'umd',
      name: 'CustomViews',
      banner,
      exports: 'named'
    },
    plugins: [typescript(), terser()]
  }
];
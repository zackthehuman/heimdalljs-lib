import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/runtime/browser/index.js',
  // module name is really heimdalljs but this is the global name
  moduleName: 'heimdall',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    nodeResolve({ jsnext: true, main: true }),
    commonjs({ include: 'node_modules/**', ignoreGlobal: true }),
  ],
  targets: [
    { dest: 'dist/heimdalljs.umd.js', format: 'umd' },
    { dest: 'dist/heimdalljs.iife.js', format: 'iife' },
  ]
};


import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import builtin from 'builtin-modules';
import bundleSize from 'rollup-plugin-bundle-size';

export default {
  input: './src/testLambda.ts',
  output: [
    {
      file: 'dist/lambda.js',
      format: 'cjs',
    },
  ],

  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          declarationMap: false,
          module: 'es2015',
          sourceMap: false,
        },
      },
    }),
    terser({ output: { comments: false } }),
    bundleSize(),
  ],

  external: [...builtin, 'aws-sdk'],
};

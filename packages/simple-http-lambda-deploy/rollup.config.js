import typescript from '@fmtk/rollup-plugin-ts';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import builtin from 'builtin-modules';
import bundleSize from 'rollup-plugin-bundle-size';

const DEBUGGING = !!process.env.DEBUG_LAMBDA;

export default {
  input: './src/testLambda.ts',
  output: [
    {
      file: 'dist/lambda.js',
      format: 'cjs',
      sourcemap: DEBUGGING,
    },
  ],

  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: {
        overrides: {
          compilerOptions: {
            declaration: DEBUGGING,
            declarationMap: DEBUGGING,
            module: 'es2015',
            sourceMap: DEBUGGING,
          },
        },
      },
    }),
    !DEBUGGING && terser({ output: { comments: false } }),
    !DEBUGGING && bundleSize(),
  ].filter(Boolean),

  external: DEBUGGING ? nonLocal : [...builtin, 'aws-sdk'],
};

function nonLocal(id) {
  return !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0');
}

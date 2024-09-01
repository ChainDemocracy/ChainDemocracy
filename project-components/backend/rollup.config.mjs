import run from '@rollup/plugin-run';
import typescript from '@rollup/plugin-typescript';
import { nodeExternals } from 'rollup-plugin-node-externals';

const dev = process.env.NODE_ENV !== 'production';

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/bundle.js',
    format: 'cjs',
    sourcemap: true,
  },

  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeExternals(),
    dev && run(),
  ],
};

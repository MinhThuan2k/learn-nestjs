import swcDefaultConfig from '@nestjs/cli/lib/compiler/defaults/swc-defaults';

export default {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig.swcDefaultsFactory().swcOptions,
        },
      },
    ],
  },
};

const webpack = require('webpack');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const lazyImports = [
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  'ts-loader',
  'aws-lambda',
];

module.exports = {
  entry: './src/main.ts',
  optimization: {
    minimize: false,
  },
  target: 'node',
  mode: 'production',
  devtool: false,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
    }),
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(require('config')),
    }),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        if (lazyImports.includes(resource)) {
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
        }
        return false;
      },
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
};

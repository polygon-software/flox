// // Webpack configuration (used for Lambda / serverless deployment)
// module.exports = (options, webpack) => {
//   const lazyImports = [
//     '@nestjs/microservices/microservices-module',
//     '@nestjs/websockets/socket-module',
//     '@nestjs/sequelize',
//     '@nestjs/terminus',
//     '@nestjs/mongoose',
//     'apollo-server-fastify',
//     '@apollo/subgraph',
//     '@apollo/gateway',
//     'class-transformer/storage',
//     'pg-native',
//     '@mikro-orm/core',
//   ];
//
//   return {
//     module: {
//       rules: [
//         {
//           test: /\.ts$/,
//           use: {
//             loader: 'babel-loader',
//             options: {
//               presets: ['@babel/preset-env', '@babel/preset-typescript'],
//             },
//           },
//           exclude: /node_modules/,
//         },
//       ],
//     },
//     resolve: {
//       extensions: ['.ts'],
//     },
//     ...options,
//     externals: [],
//     plugins: [
//       ...options.plugins,
//       new webpack.CleanPlugin(),
//       new webpack.IgnorePlugin({
//         checkResource(resource) {
//           if (lazyImports.includes(resource)) {
//             try {
//               require.resolve(resource);
//             } catch (err) {
//               return true;
//             }
//           }
//           return false;
//         },
//       }),
//     ],
//   };
// };

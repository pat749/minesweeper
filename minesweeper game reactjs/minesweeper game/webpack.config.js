const path = require('path');

const isProd =
  process.env.NODE_ENV === 'production' || process.argv.includes('--mode=production');

module.exports = {
  context: __dirname,
  entry: './react_minesweeper.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env', '@babel/react'],
          },
        },
      },
    ],
  },
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '*'],
  },
};

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipFilesPlugin = require('webpack-zip-files-plugin');

// TODO also dev version for facebook.

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
});

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js'),
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader'],

  },
  output: {
    path: path.resolve(__dirname, `dist/${__dirname.split('\\').slice(-1)}-build`),
    publicPath: './',
    filename: 'js/bundle.js',
  },
  plugins: [
    definePlugin,
    new CleanWebpackPlugin([`dist/${__dirname.split('\\').slice(-1)}-build`]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' /* chunkName= */, filename: 'js/vendor.bundle.js' /* filename= */ }),
    new HtmlWebpackPlugin({
      filename: 'index.html', // path.resolve(__dirname, 'build', 'index.html'),
      template: './src/index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true,
      },
      hash: true,
    }),
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
      { from: 'fbapp-config.json', to: '' },
    ]),
    new ZipFilesPlugin({
      entries: [
        { src: path.join(__dirname, './' + `dist/${__dirname.split('\\').slice(-1)}-build\\assets`),             dist: `${__dirname.split('\\').slice(-1)}-build\\assets` },
        { src: path.join(__dirname, './' + `dist/${__dirname.split('\\').slice(-1)}-build\\js`),                 dist: `${__dirname.split('\\').slice(-1)}-build\\js` },
        { src: path.join(__dirname, './' + `dist/${__dirname.split('\\').slice(-1)}-build\\fbapp-config.json`),  dist: `${__dirname.split('\\').slice(-1)}-build\\fbapp-config.json` },
        { src: path.join(__dirname, './' + `dist/${__dirname.split('\\').slice(-1)}-build\\index.html`),         dist: `${__dirname.split('\\').slice(-1)}-build\\index.html` },
      ],
      output: path.join(__dirname, './' + `${__dirname.split('\\').slice(-1)}-build`),
      format: 'zip',
    }),
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  resolve: {
    alias: {
      phaser,
      pixi,
      p2,
    },
  },
};

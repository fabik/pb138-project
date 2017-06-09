const webpack = require('webpack');

const paths = require('./webpack.paths');

module.exports = {
  devServer: {
    hot: true,
    contentBase: './src/',
    host: '0.0.0.0',
    port: 8088,
    stats: 'minimal'
  },
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'whatwg-fetch',
    paths.javascriptEntryPath,
    paths.htmlEntryPath
  ],
  output: {
    path: paths.buildPath,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['react-hot-loader', 'babel-loader']
    }, {
      test: /\.html$/,
      loader: 'file-loader?name=[name].[ext]'
    }, {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader?importLoaders=1'
      ]
    }, {
      test: /\.png$/,
      loader: "file-loader?limit=100000"
    }, {
      test: /\.(jpg|gif)$/,
      loader: "file-loader"
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader?limit=10000&mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader?limit=10000&mimetype=image/svg+xml'
    }]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

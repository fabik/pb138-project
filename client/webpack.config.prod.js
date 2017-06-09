const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const paths = require('./webpack.paths');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'whatwg-fetch',
    paths.javascriptEntryPath,
    paths.htmlEntryPath
  ],
   output: {
    path: paths.buildPath,
    filename: 'bundle.js',
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
    new CopyWebpackPlugin([
      { from: 'src/gentelella', to: 'gentelella' },
    ]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true
      }
    })
  ]
};

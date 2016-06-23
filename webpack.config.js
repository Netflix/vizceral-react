'use strict';
var path = require('path');
var webpack = require('webpack');
var yargs = require('yargs');

var options = yargs
  .alias('p', 'optimize-minimize')
  .alias('d', 'debug')
  .argv;

var config = {
  entry: './src/vizceral.jsx',
  output: {
    path: './dist',
    filename: options.optimizeMinimize ? 'vizceral.min.js' : 'vizceral.js',
    library: 'Vizceral',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.jsx', '.js'],
    modulesDirectories: ['node_modules', 'bower_components']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ]

};

if (!options.optimizeMinimize) {
  config.devtool = 'source-map';
}

module.exports = config;

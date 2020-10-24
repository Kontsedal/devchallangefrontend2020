const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const PATHS = require('./paths');

const cleanDistFolder = new CleanWebpackPlugin();

const analyzeBundleSize = new BundleAnalyzerPlugin({
  analyzerPort: 3838,
});

const processIndexHtml = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: path.join(PATHS.SRC_DIR, 'index.html'),
});

module.exports = {
  cleanDistFolder,
  analyzeBundleSize,
  processIndexHtml
};

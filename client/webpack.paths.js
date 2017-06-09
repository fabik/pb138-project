const path = require('path');

module.exports = {
  javascriptEntryPath: path.resolve(__dirname, 'src', 'index.js'),
  htmlEntryPath: path.resolve(__dirname, 'src', 'index.html'),
  buildPath: path.resolve(__dirname, 'dist')
};

const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: './src/scripts.ts',
  module: {
    rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, './app.ts', './routes.ts', './utility.ts', './index.ts']
      },
      {
        test: /\.css$/, 
        use:'css-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  externals: {
    "jquery": "jQuery",
    "jqueryui": "jQuery-ui"
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist')
  }
}
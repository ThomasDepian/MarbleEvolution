const path = require('path');
module.exports = {
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg)$/,
        loader: ['url-loader']
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development'
};
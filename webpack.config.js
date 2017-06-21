// WEBPACK: CONFIG
const webpackConfig = {
  entry: './client',

  output: {
    path: '/',
    publicPath: '/static',
    filename: 'bundle.js',
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }],
  },
};
export default webpackConfig

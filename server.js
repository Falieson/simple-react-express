import express from 'express';
import morgan from 'morgan'
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

import webpackConfig from './webpack.config'

// EXPRESS: START
const PORT = 3000;
const app = express();

app.use(webpackMiddleware(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
}));


// EXPRESS: CONSOLE LOGGER
app.use(morgan('dev'))

// EXPRESS: LAUNCH
app.listen(PORT, () => {
  console.log(`Still webpacking!`); // eslint-disable-line no-console
  console.log(`listening on port ${PORT}`); // eslint-disable-line no-console
});

app.get('/', function (req, res) {
  // res.send(  <h1>Foo Bar, world!</h1>)
  res.sendFile(__dirname + '/index.html')
})

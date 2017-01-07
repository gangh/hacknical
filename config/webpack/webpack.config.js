const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssImport = require("postcss-import");
const cssnext = require("postcss-cssnext");

const PATH = require('./path');
const path = require('path');
const fs = require('fs');
const styleVariables = require('../../app/frontend/src/styles/variables');

const entryFiles = fs.readdirSync(PATH.ENTRY_PATH);

const files = [];
const entries = {};

entryFiles
  .filter(file =>
    file.split('.')[0] && file.split('.').slice(-1)[0] === 'js'
  )
  .forEach(file => {
    const filename = file.split('.')[0];
    const filepath = path.join(PATH.ENTRY_PATH, file)
    entries[filename] = filepath;
});

const cssLoaderString = [
  'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
  'postcss-loader'
];
cssLoaderString[0] = `${cssLoaderString[0]}&sourceMap`;
const cssLoader = ExtractTextPlugin.extract(
  'style-loader',
  cssLoaderString.join('!')
);

const postcssPlugin = function(_webpack) {
  return [
    cssImport({
      addDependencyTo: _webpack
    }),
    cssnext({
      autoprefixer: {
        browsers: "ie >= 9, ..."
      },
      features: {
        customProperties: {
          variables: styleVariables
        }
      }
    })
  ];
}

module.exports = {
  context: PATH.ROOT_PATH,
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    path: PATH.BUILD_PATH,
    publicPath: PATH.SERVER_PATH
  },
  module: {
    loaders: [
      { test: require.resolve("jquery"), loader: "expose?jQuery" },
      { test: require.resolve("jquery"), loader: "expose?$" },
      {
        test: /\.css$/,
        include: PATH.SOURCE_PATH,
        exclude: path.join(PATH.SOURCE_PATH, 'src/vendor'),
        loader: cssLoader,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css!postcss"),
        exclude: PATH.SOURCE_PATH
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css!postcss"),
        include: path.join(PATH.SOURCE_PATH, 'src/vendor')
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: ["babel-loader"],
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)\??.*$/,
        loader: "url-loader?limit=8192&name=[name].[ext]"
      }
    ],
  },
  resolve: {
    root: PATH.SOURCE_PATH,
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      COMPONENTS: path.join(PATH.SOURCE_PATH, 'components'),
      MOCK: path.join(PATH.SOURCE_PATH, 'src/mock'),
      UTILS: path.join(PATH.SOURCE_PATH, 'utils'),
      IMAGES: path.join(PATH.SOURCE_PATH, 'src/images'),
      PAGES: path.join(PATH.SOURCE_PATH, 'pages'),
      API: path.join(PATH.SOURCE_PATH, 'api'),
      VENDOR: path.join(PATH.SOURCE_PATH, 'src/vendor'),
      SHAREDPAGE: path.join(PATH.SOURCE_PATH, 'pages/shared'),
    }
  },
  postcss: postcssPlugin,
  plugins: [
    new ExtractTextPlugin("[name].bundle.css", {
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new CleanPlugin(PATH.BUILD_PATH, {
      root: PATH.ROOT_PATH,
      verbose: true
    })
  ],
  displayErrorDetails: true,
  outputPathinfo: true
};
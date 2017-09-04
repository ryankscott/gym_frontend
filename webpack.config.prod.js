const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const BabiliWebpackPlugin = require("babili-webpack-plugin");
const ROOT_PATH = path.resolve(__dirname);
const PORT = 8080;

module.exports = () => ({
  context: ROOT_PATH,

  entry: [
    `webpack-dev-server/client?http://localhost:${PORT}`,
    "webpack/hot/only-dev-server",
    "babel-polyfill",
    "./src/index.js"
  ],

  devtool: "#cheap-source-map",

  output: {
    publicPath: "/",
    path: ROOT_PATH,
    filename: "build/main.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /(normalize.css|alert.css|alert-stackslide.css|calendar.css)/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              minimize: false,
              camelCase: true,
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]__[local]--[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        include: /(normalize.css|alert.css|alert-stackslide.css|calendar.css)/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false
      },
      mangle: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HTMLWebpackPlugin({
      inject: false,
      template: path.resolve(ROOT_PATH, "index.html"),
      showErrors: true
    }),
    new webpack.DefinePlugin({
      __GYMCLASS_URL__: JSON.stringify(""),
      __GYMCLASS_REDIRECT_URL__: JSON.stringify("https://ryankscott.com"),
      "process.env.NODE_ENV": '"production"'
    }),
    new BabiliWebpackPlugin(
      {
        deadcode: false,
        mangle: { topLevel: true },
        removeConsole: true
      },
      {
        test: /\.js$/
      }
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: "main",
      children: false,
      minChunk: 2
    }),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200 // ~50kb
    })
  ],

  devServer: {
    stats: "minimal",
    hot: true,
    publicPath: "/",
    port: PORT,
    host: "localhost",
    historyApiFallback: true,
    noInfo: false
  }
});

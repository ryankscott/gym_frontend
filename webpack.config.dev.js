const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

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

  devtool: "#inline-source-map",

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
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __GYMCLASS_URL__: JSON.stringify("http://localhost:9000"),
      __GYMCLASS_REDIRECT_URL__: JSON.stringify("http://localhost:8080"),
      "process.env.NODE_ENV": '"dev"'
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

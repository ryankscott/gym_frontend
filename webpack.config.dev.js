const webpack = require("webpack");
const path = require("path");
const buildPath = path.resolve(__dirname, "build");

module.exports = {
  entry: "./src/index.js",
  output: {
    publicPath: "/build/",
    path: "./build/",
    filename: "main.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      __GYMCLASS_URL__: JSON.stringify(process.env.GYMCLASS_URL) ||
        JSON.stringify(""),
      __GYMCLASS_REDIRECT_URL__: JSON.stringify(
        process.env.GYMCLASS_REDIRECT_URL
      ) || JSON.stringify(""),
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      )
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel"],
        gifsicle: {
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        pngquant: {
          quality: "75-90",
          speed: 3
        }
      },
      {
        test: /(\.scss|\.css)$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          "file?hash=sha512&digest=hex&name=/img/[hash].[ext]",
          "image-webpack"
        ]
      }
    ]
  },
  sassLoader: {
    includePaths: ["./node_modules"]
  }
};

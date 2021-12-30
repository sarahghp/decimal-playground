const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/app.js",
  mode: "development",
  target: "web",
  module: {
    rules: [
      {
        test: /\.[j]sx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  output: {
    filename: "bundle.js",
  },
  devServer: {
    port: 4444,
    static: "./",
  },
  devtool: "eval-source-map",
};

const path = require("path");
const webpack = require("webpack");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
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
    clean: true,
  },
  devServer: {
    port: 4444,
    static: "./",
  },
  devtool: "eval-source-map",
  plugins: [new MonacoWebpackPlugin({
    languages: ['javascript', 'typescript']
  })],
};

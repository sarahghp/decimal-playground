const path = require("path");
const webpack = require("webpack");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  target: "web",
  module: {
    rules: [
      {
        test: /\.[j]sx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
    },
  },
  output: {
    filename: "bundle.js",
    clean: true,
  },
  devServer: {
    port: 4444,
    static: "./",
  },
  devtool: "eval",
  plugins: [
    new NodePolyfillPlugin(),
    new MonacoWebpackPlugin({
      languages: ["javascript", "typescript"],
    }),
  ],
};

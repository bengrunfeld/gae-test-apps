/* This config file is only for use by Webpack Dev Middleware
 * which can be found in the main Express file. For prod builds
 * use webpack.config.js
 *
 * Note: that prod and dev mode are set in npm scripts.
 */
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// There's a problem with Webpack HMR - left comment on issue
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000';

const path = require("path")

module.exports = {
  entry: {
    server: './src/server/server.js',
    // main: './src/index.js',

    // Webpack Hot Middleware
    client: ['./src/index.js', hotMiddlewareScript],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  mode: 'development',  // This is the only line that merrits a
                        // second config file. No way to set it otherwise
                        // since webpack-dev-middleware cannot consume a 
                        // Webpack 4 function, which is how you identify 
                        // dev|prod mode. We only need dev mode here
                        // since webpack-dev-middleware is only used for dev
  target: 'node',
  devtool: '#source-map',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        // Loads CSS into a file when you import it via Javascript
        // Rules are set in MiniCssExtractPlugin
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        // Loads images into CSS and Javascript files
        test: /\.jpg$/,
        use: [{loader: "url-loader"}]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/html/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

// Webpack 4 basic tutorial:
// https://www.valentinog.com/blog/webpack-4-tutorial/#webpack_4_production_and_development_mode

// Development mode is optimized for build speed and does nothing more than providing an un-minified bundle.
// Production mode enables all sorts of optimizations like minification, scope hoisting, tree-shaking and more.
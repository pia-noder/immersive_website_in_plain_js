const path = require("path"); // Verifier le path de l'app
const webpack = require("webpack");
//Plugin qui copie des fichiers d'un endroit à un autre
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin"); //minify js file more than what babel does

//variable qui verifie depuis node.js la version qui est executée
const IS_DEV = process.env.NODE_ENV === "development";

const dirApp = path.join(__dirname, "app");
const dirAssets = path.join(__dirname, "assets");
const dirStyles = path.join(__dirname, "styles");
const dirNode = "node_modules";

module.exports = {
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],

  resolve: {
    modules: [dirApp, dirAssets, dirStyles, dirNode],
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./assets",
          to: "", //no need to include any name here as every importnt folders path are already declared above
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            // Svgo is pris en charge par                   ,
          ],
        },
      },
    }),
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/, //verifie que le fichier finie par js
        use: {
          //Un loader est un programme qui  permet à Webpack de pouvoir gérer un certain type de fichier.
          loader: "babel-loader", // babel-loader est utilise pour webpack  compile les fichiers js
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.pug$/,
        use: {
          //Un loader est un programme qui  permet à Webpack de pouvoir gérer un certain type de fichier.
          loader: "pug-loader", // babel-loader est utilise pour webpack  compile les fichiers js
        },
      },
      {
        test: /\.scss$/, //indique à Webpack que lorsqu’il rencontre un fichier de type scss il doit utiliser le loader sass
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader", //necessaire car Webpack ne comprend pas nativement le css
          },
          {
            loader: "postcss-loader", //ajoute les autoprefix sur les browser qui n'accepte pas encore nativement la feature
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      //Ajouter la minification des image dans webpack
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/, //types de fichier acceptés
        loader: "file-loader",
        options: {
          name(file) {
            return "[hash].[ext]"; //utiliser un hash permet d'eviter que l'image soit envoyer dans le cache
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
          },
        ],
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "raw-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "glslify-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

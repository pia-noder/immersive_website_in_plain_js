const path = require('path') // Verifier le path de l'app
const webpack = require('webpack')
//Plugin qui copie des fichiers d'un endroit à un autre  
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
//variable qui verifie depuis node.js la version qui est executée
const IS_DEV = process.env.NODE_ENV === 'development'

const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'

module.exports = {
    entry:[
        path.join(dirApp, 'index.js'),
        path.join(dirStyles, 'index.scss')
    ],

    resolve:{
        modules:[
            dirApp,
            dirAssets,
            dirStyles,
            dirNode
        ],
    },
    plugins:[
        new webpack.DefinePlugin({
            IS_DEV
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './assets',
                    to: '' //no need to include any name here as every importnt folders path are already declared above 
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
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
    ],

    module: {
        rules:[
            {
                test: /\.js$/,//verifie que le fichier finie par js
                use: {
                    loader: 'babel-loader', // babel-loader est utilise pour webpack aui compile les fichiers js
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,//verifie aue le fichier finie par scss
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options:{
                            publicPath: ''
                        }
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader', //ajoute les autoprefix sur les browser qui n'accepte pas encore nativement la feature
                    },
                    {
                        loader: 'sass-loader', 
                    },
                ]
            },
//Ajouter la minification des image dans webpack
            {
                test:/\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/, //types de fichier acceptés
                loader: 'file-loader',  
                options: {
                    name(file){
                        return '[hash].[ext]'//utiliser un hash permet d'eviter que l'imager soit envoyer dans le cache
                    }
                }
            }
        ]
    }
}

console.log(dirApp, dirAssets, dirStyles)
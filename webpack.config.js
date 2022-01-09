const path = require('path') // Verifier le path de l'app
const webpack = require('webpack')
//Plugin qui copie des fichiers d'un endroit à un autre  
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//variable qui verifie depuis node.js la version qui est executée
const IS_DEV = process.env.NODE_ENV === 'development'

const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirImages = path.join(__dirname, 'images')
const dirStyles = path.join(__dirname, 'styles')
const dirVideos = path.join(__dirname, 'videos')
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
                    to: ''
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],

    module: [
        rules:[
            {
                test: /\.js$/,//verifie aue le fichier finie par js
                use: {
                    loader: 'babel-loader', // babel-loader est utilise poyur webpack aui compile les fichiers js

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
                test:/\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/, 
                loader: 'file'
            }
        ]
    ]
}

console.log(dirApp, dirAssets, dirStyles)
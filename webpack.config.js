const path = require('path') // Verifier le path de l'app
const webpack = require('webpack')
//Plugin qui copie des fichiers d'un endroit à un autre  
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
        new webpack.ProvidePlugin({

        })
    ]
}

console.log(dirApp, dirAssets, dirStyles)
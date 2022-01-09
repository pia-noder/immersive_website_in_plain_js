const path = require('path') // Verifier le path de l'app

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const {merge} = require('webpack-merge')

const config =  require('./webpack.config')

module.exports= merge(config, {
    mode: 'production',

    output:{
        path: path.resolve(__dirname, 'public')
    },

    plugins: [
        new CleanWebpackPlugin()
    ]
})

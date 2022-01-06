const {merge} = require('webpack-merge')
const path = require('path')

const config = require('./webpack.config')

module.exports = merge(config, {
    mode: 'development', //set le mode de webpack 

    devtool: 'inline-source-map', //inspect

    devServer: {
        devMiddleware:{
          writeToDisk: true  
        }
        
    },

    output: {
        path: path.resolve(__dirname, 'public')
    }
})
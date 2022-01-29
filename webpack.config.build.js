const path = require('path') // Verifier le path de l'app


const {merge} = require('webpack-merge')
const config =  require('./webpack.config')

module.exports = merge(config, {
    mode: 'production',

    output:{
        path: path.join(__dirname, 'public')
    },
})

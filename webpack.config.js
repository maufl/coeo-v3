var webpack = require('webpack');
var process = require('process');

var env = process.env.NODE_ENV || 'development';

var entry = './app/bootstrap';
var output = {
    path: '.',
    filename: 'bundle.js'
}
var loaders = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
    },
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
    },
    {
        test: /\.json$/,
        loader: 'json'
    }
];
var resolve = {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
}
var plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(env)
        }
    })
];

module.exports = {
    devtool: "#cheap-module-source-map",
    entry: entry,
    output: output,
    resolve: resolve,
    plugins: plugins,
    module: {
        loaders: loaders
    },
    devServer: {
        hot: true,
        inline: true,
        colors: true,
        progress: true
    },
    devServer: {
        stats: {
            chunkModules: false
        }
    }
}

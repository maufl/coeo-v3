
var entry = './app/bootstrap';
var output = {
    path: 'build',
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

module.exports = {
    devtool: "#cheap-module-source-map",
    entry: entry,
    output: output,
    resolve: resolve,
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

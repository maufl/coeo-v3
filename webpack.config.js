
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
    }
];
var resolve = {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
}

module.exports = {
    devtool: "source-map",
    entry: entry,
    output: output,
    resolve: resolve,
    module: {
        loaders: loaders
    }
}

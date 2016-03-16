
var entry = './app/app.tsx';
var output = {
    path: 'build',
    filename: 'bundle.js'
}
var loaders = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
    }
];

module.exports = {
    devtool: "source-map",
    entry: entry,
    output: output,
    module: {
        loaders: loaders
    }
}

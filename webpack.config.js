const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
    externals: [{ 'aws-sdk': 'commonjs aws-sdk' }],
    output: {
        libraryTarget: 'commonjs',
        filename: '[name].js',
        path: path.join(__dirname, '.webpack')
    },
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                include: __dirname,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    }
};

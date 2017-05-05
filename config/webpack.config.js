const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = {
    entry: {
        app: [
            'react-hot-loader/patch',
            '<%= "#{Lanes::Extensions.controlling.identifier}/index.js" %>',
        ],
        'embedded-events': [
            'react-hot-loader/patch',
            'sm/embed/events.js',
        ],
        homepage: [
            'sm/homepage/index.js',
        ],
    },
    output: {
        path: '<%= directory.join('..','public', 'assets') %>',
        publicPath: '<%= Lanes.env.production? ? '/assets/' : 'http://localhost:8889/assets/' %>',
        filename: '[name].js',
    },
    resolve: {
        modules: ["<%= module_paths.join('","') %>"],
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader',  'css-loader' ]
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000,
                },
            },
            {
                loader: 'babel-loader',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                options: {
                    plugins: [
                        'react-hot-loader/babel',
                        'babel-plugin-lodash',
                        'babel-plugin-transform-decorators-legacy',
                        'babel-plugin-transform-class-properties',
                        'babel-plugin-transform-function-bind',
                        'babel-plugin-transform-react-jsx',
                        'babel-plugin-transform-runtime',
                    ].map(require.resolve),
                    presets: [
                        [require.resolve('babel-preset-es2015'), { modules: false }],
                        require.resolve('babel-preset-react'),
                        require.resolve('babel-preset-stage-1'),
                    ],
                },
            },
            { test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [path.resolve('./node_modules')],
                        },
                    },
                ],
            },
        ],
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'app.html',
            template: '<%= directory.join('app.html') %>',
            chunks: ['app'],
        }),
        new HtmlWebpackPlugin({
            filename: 'homepage.html',
            template: '<%= directory.join('homepage.html') %>',
            chunks: ['homepage'],
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
<% if Lanes.env.production? %>
        new webpack.optimize.UglifyJsPlugin(), //minify everything
        new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
        new webpack.optimize.OccurrenceOrderPlugin(), // use smallest id for most used chuncks
<% else %>
        new webpack.NamedModulesPlugin(),
<% end %>
    ],
    node: {
        fs: 'empty',
    },
    devServer: {
        hot: true,
        inline: true,
        port: 8889,
        contentBase: './public',
        historyApiFallback: {
            index: '/assets/app.html'
        },
        proxy: [{
            context: [ '/api', '/signup' ],
            target: 'http://localhost:9292',
        }],
        disableHostCheck: true,
        stats: {
            colors: true,
            profile: true,
            hash: false,
            version: false,
            timings: false,
            assets: true,
            chunks: false,
            modules: false,
            reasons: true,
            children: false,
            source: true,
            errors: true,
            errorDetails: false,
            warnings: true,
            publicPath: false,
        },
    },
};

// console.log(config)

module.exports = config;

const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const entries = {
    app: [
        'babel-polyfill-loader!',
        '<%= "#{Hippo::Extensions.controlling.identifier}/index.js" %>',
    ],
    homepage: [
        'babel-polyfill-loader!',
        'sm/homepage/index.js',
    ],
    'embedded-shows': [
        'babel-polyfill-loader!',
        'sm/embed/shows.js',
    ],

};
<%
def dev_public_path
protocol = Hippo::Webpack.using_ssl? ? 'https' : 'http'
host = ENV['HOST'] || 'dev.argosity.com'
"#{protocol}://#{host}:8889/assets/"
end
%>

const config = {
    entry: entries,
    mode: '<%= Hippo.env.production? ? 'production' : 'development' %>',
    output: {
        path: '<%= config_directory.join('..','public', 'assets') %>',
        publicPath: '<%= Hippo.env.production? ? 'https://assets.showmaker.com/assets/' : dev_public_path  %>',
        filename: '[name]-[hash].js',
<% unless Hippo.env.production? -%>
        crossOriginLoading:  "anonymous",
<% end -%>
    },
    resolve: {
        modules: [
            "<%= Hippo::Extensions.client_module_paths.join('","') %>",
            "<%= generated_directory.to_s %>",
        ],
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
                        require.resolve('babel-preset-es2015'),
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
                            includePaths: [
                                "<%= Hippo::Extensions.client_module_paths.join('","') %>",
                            ],
                        },
                    },
                ],
            },
        ],
    },
    devtool: '<%= Hippo.env.production? ? 'source-map' : 'eval-source-map' %>',
    optimization: {
        splitChunks: {
            chunks: 'async'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"<%= Hippo.env.to_s %>"',
        }),
<% if Hippo.env.production? %>
        new UglifyJsPlugin({
            extractComments: true,
            parallel: 4,
            sourceMap: true,
            cache: true,
            uglifyOptions: {
                ecma: 8,
            }
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
        new webpack.optimize.OccurrenceOrderPlugin(), // use smallest id for most used chuncks
        new CompressionPlugin({
          asset: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.(js|html)$/,
          threshold: 10240,
          minRatio: 0.8
        })
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
        host: 'dev.argosity.com',
        contentBase: './public',
        historyApiFallback: {
            index: '/assets/app.html'
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
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

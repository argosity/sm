module.exports = ({ platform }, defaults) => ({
    entry: `./index.${platform}.js`,

    resolve: {
        ...defaults.resolve,
        symlinks: false,
        modules: [
            '.',
            './node_modules',
        ],
    },

    // module: {
    //     ...defaults.module,

    // }

    //     rules: [
    //         {
    //             loader: 'babel-loader',
    //             test: /\.jsx?$/,
    //             exclude: /node_modules\/(?!(hippo-fw)\/)/,
    //             options: {
    //                 plugins: [
    //                     'react-hot-loader/babel',
    //                     'babel-plugin-lodash',
    //                     'babel-plugin-transform-decorators-legacy',
    //                     'babel-plugin-transform-class-properties',
    //                     'babel-plugin-transform-function-bind',
    //                     'babel-plugin-transform-react-jsx',
    //                     'babel-plugin-transform-runtime',
    //                 ].map(require.resolve),
    //                 presets: [
    //                     require.resolve('babel-preset-react-native'),
    //                     require.resolve('babel-preset-stage-1'),
    //                 ],
    //             },
    //         },
    //     ],
    // },
});

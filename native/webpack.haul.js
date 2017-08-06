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

    module: {
        ...defaults.module,
        rules: [
            ...defaults.module.rules,
            { test: /\.css$/, use: 'ignore-loader' },
        ],
    },

});

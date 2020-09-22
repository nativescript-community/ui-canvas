const webpackConfig = require('./webpack.config.js');
const webpack = require('webpack');
const { resolve } = require('path');

module.exports = (env, params = {}) => {
    const { development } = env;
    const projectRoot = __dirname;
    const config = webpackConfig(env, params);
    if (development) {
        config.resolve.alias['@nativescript/core'] = '@akylas/nativescript';
        const srcPath = resolve(projectRoot, '..', 'src');
        config.resolve.alias['@nativescript-community/ui-canvas'] = srcPath;
        config.resolve.alias['@nativescript-community/ui-canvas$'] = srcPath;
        config.plugins.push(new webpack.ContextReplacementPlugin(new RegExp('@nativescript-community/ui-canvas'), srcPath));
    }
    return config;
};

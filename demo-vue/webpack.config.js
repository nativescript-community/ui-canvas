const WebpackTemplate = require('nativescript-akylas-webpack-template');
const { resolve } = require('path');
module.exports = env => {
    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    const {
        development = false,
    } = env;
    let aliases = {
        'nativescript-vue': 'akylas-nativescript-vue',
        vue: 'nativescript-vue'
    }
    const projectRoot = __dirname;
    if (!!development) {
        const srcFullPath = resolve(projectRoot, '..', 'src');
        aliases = Object.assign(aliases, {
            '#': srcFullPath,
            'nativescript-canvas$': '#/canvas.' + platform,
            'nativescript-canvas/vue$': '#/vue/index',
            '../canvas$': '#/canvas.' + platform,
            './canvas$': '#/canvas.' + platform,
            '../shapes/line$': '#/shapes/line',
            '../shapes/text$': '#/shapes/text',
            '../shapes/arc$': '#/shapes/arc',
            '../shapes/rectangle$': '#/shapes/rectangle',
        });
    }
    console.log('running webpack with env', env);
    const config = WebpackTemplate(env, {
        projectRoot,
        targetArchs:['arm'],
        alias:aliases,
        chunkTestCallback:function(moduleName) {return /canvas/.test(moduleName)}
    });
    return config;
};

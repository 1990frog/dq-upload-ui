/*
 * @Author: your name
 * @Date: 2021-01-20 14:18:06
 * @LastEditTime: 2021-03-19 10:24:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\vue.config.js
 */

let target = "http://192.168.0.114:9999"

module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },

    // 引入scss全局变量
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "@/assets/scss/_variable.scss";`
            },
        }
    },

    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,

    // 代理配置
    devServer: {
        port: 7178,
        open: true,
        proxy: {
            // 与axios的urlbase要一致；
            '/clinbrain/api': {
                changeOrigin: true,
                target: target,
                pathRewrite: {
                    '^/clinbrain/api': ''
                }
            },
            //图片代理地址
            '/upload/image': {
                changeOrigin: true,
                target: target
            }
        }
    },

}
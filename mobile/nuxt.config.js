const path = require('path')
const vuxLoader = require('vux-loader')

module.exports = {
    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    css: [
        'vux/src/styles/reset.less',
        'vux/src/styles/1px.less',
        '~assets/styles/common.less'
    ],
    loading: { color: '#80bd01' },
    performance: {
        prefetch: false
    },
    render: {
        resourceHints: false
    },
    build: {
        extend (config, ctx) {
            if (ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
            const configs = vuxLoader.merge(config, {
                options: {
                    ssr: true
                },
                plugins: ['vux-ui', {
                    name: 'less-theme',
                    path: path.join(__dirname, './assets/styles/vuxtheme.less')
                }]
            })
            return configs
        },
        vendor: ['axios']
    },
    plugins: [
        { src: '~/plugins/vux-plugins', ssr: false },
        { src: '~plugins/bdStat.js', ssr: false },
        // { src: '~plugins/adsense.js', ssr: false },
        { src: '~plugins/refreshToken.js', ssr: true }
    ]
}

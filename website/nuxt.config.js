module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%sGolang中文社区 - 与地鼠们分享你的知识、经验和见解',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '一个专业的Golang技术社区，帮助你寻找答案，分享知识。' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/styles/iview-2.0.0.css' }
    ]
  },
  css: [
    '~assets/styles/common.css'
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#80bd01' },
  build: {
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['axios']
  },
  plugins: [
    { src: '~plugins/ga.js', ssr: false }
  ]
}

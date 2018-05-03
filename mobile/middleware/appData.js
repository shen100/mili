import request from '~/net/request'

export default function (context, next) {
    Promise.all([
        request.getSiteInfo({client: context.req}),
        request.getUserInfo({client: context.req})
    ]).then((arr) => {
        let siteConfig = arr[0].data.siteConfig
        let baiduAdConfig = arr[0].data.baiduAdConfig
        context.user = arr[1].data.user || null
        context.store.commit('siteConfig', siteConfig)
        context.store.commit('baiduAdConfig', baiduAdConfig)
        context.store.commit('user', context.user)
        next()
    }).catch((err) => {
        console.log(err)
        context.error({ statusCode: 404, message: 'Page not found' })
    })
}

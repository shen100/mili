import UserRole from '~/constant/UserRole'
import request from '~/net/request'

export default function (context, next) {
    Promise.all([
        request.getSiteInfo({client: context.req}),
        request.getUserInfo({client: context.req})
    ]).then((arr) => {
        let siteConfig = arr[0].data.siteConfig
        context.user = arr[1].data.user || null
        if (!context.user) {
            context.redirect('/signin?ref=' + encodeURIComponent(context.req.url))
        } else {
            let user = context.user
            let admins = [
                UserRole.USER_ROLE_ADMIN,
                UserRole.USER_ROLE_SUPER_ADMIN,
                UserRole.USER_ROLE_CRAWLER_ADMIN
            ]
            if (admins.indexOf(user.role) >= 0) {
                context.store.commit('siteConfig', siteConfig)
                context.store.commit('user', context.user)
                context.store.commit('isAdminPage', true)
                next()
            } else {
                context.error({ statusCode: 403, message: 'forbidden' })
            }
        }
    }).catch((err) => {
        console.log(err)
        context.error({ statusCode: 404, message: 'Page not found' })
    })
}

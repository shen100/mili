import cookie from '~/utils/cookie'

export default ({ app: { router }, req, res }) => {
    router.afterEach((to, from) => {
        if (typeof window === 'undefined') {
            cookie.refreshTokenCookie(req, res)
        }
    })
}

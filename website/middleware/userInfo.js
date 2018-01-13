import request from '~/net/request'
import cookie from '~/utils/cookie'

export default function (context, next) {
    cookie.refreshTokenCookie(context.req, context.res)
    request.getUserInfo({client: context.req})
        .then(data => {
            context.user = data.data.user || null
            next()
        })
}

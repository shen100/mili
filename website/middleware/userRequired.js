import request from '~/net/request'
import ErrorCode from '~/constant/ErrorCode'
import cookie from '~/utils/cookie'

export default function (context, next) {
    cookie.refreshTokenCookie(context.req, context.res)
    request.getUserInfo({client: context.req})
        .then(data => {
            if (data.errNo === ErrorCode.LOGIN_TIMEOUT) {
                context.redirect('/signin?ref=' + encodeURIComponent(context.req.url))
            } else {
                context.user = data.data.user
                next()
            }
        })
        .catch(err => {
            console.log(err)
            context.error({ statusCode: 404, message: 'Page not found' })
        })
}

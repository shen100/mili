import request from '~/net/request'
import ErrorCode from '~/constant/ErrorCode'
import UserRole from '~/constant/UserRole'
import cookie from '~/utils/cookie'

export default function (context, next) {
    cookie.refreshTokenCookie(context.req, context.res)
    return request.getUserInfo({client: context.req})
        .then(data => {
            if (data.errNo === ErrorCode.LOGIN_TIMEOUT) {
                context.redirect('/signin?ref=' + encodeURIComponent(context.req.url))
                context.redirect('/signin')
            } else {
                let user = data.data.user
                let admins = [
                    UserRole.USER_ROLE_ADMIN,
                    UserRole.USER_ROLE_SUPER_ADMIN,
                    UserRole.USER_ROLE_CRAWLER_ADMIN
                ]
                if (admins.indexOf(user.role) >= 0) {
                    next()
                } else {
                    context.error({ statusCode: 403, message: 'forbidden' })
                    next()
                }
            }
        })
}

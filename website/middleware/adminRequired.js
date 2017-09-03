import request from '~/net/request'
import ErrorCode from '~/constant/ErrorCode'
import UserRole from '~/constant/UserRole'

export default function (context, next) {
    return request.getUserInfo({client: context.req})
        .then(data => {
            if (data.errNo === ErrorCode.LOGIN_TIMEOUT) {
                context.redirect('/signin')
            } else {
                let user = data.data.user
                if (user.role === UserRole.USER_ROLE_ADMIN || user.role === UserRole.USER_ROLE_SUPER_ADMIN) {
                    next()
                } else {
                    context.error({ statusCode: 403, message: 'forbidden' })
                    next()
                }
            }
        })
}

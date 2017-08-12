import request from '~/net/request'
import ErrorCode from '~/constant/ErrorCode'

export default function (context, next) {
    request.getUserInfo({client: context.req})
        .then(data => {
            if (data.errNo === ErrorCode.LOGIN_TIMEOUT) {
                context.redirect('/signin')
            } else {
                context.user = data.data.user
                next()
            }
        })
}

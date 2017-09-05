import request from '~/net/request'
import session from '~/utils/session'

export default function (context, next) {
    session.shiftExpiration(context.req, context.res)
    request.getUserInfo({client: context.req})
        .then(data => {
            context.user = data.data.user || null
            next()
        })
}

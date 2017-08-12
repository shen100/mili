import request from '~/net/request'

export default function (context, next) {
    request.getUserInfo({client: context.req})
        .then(data => {
            context.user = data.data.user || null
            next()
        })
}

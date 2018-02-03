import UserRole from '~/constant/UserRole'

export default function (context, next) {
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
            next()
        } else {
            context.error({ statusCode: 403, message: 'forbidden' })
        }
    }
}

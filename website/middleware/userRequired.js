export default function (context, next) {
    if (!context.user) {
        context.redirect('/signin?ref=' + encodeURIComponent(context.req.url))
    } else {
        next()
    }
}

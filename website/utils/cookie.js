import config from '~/config'

export default {
    refreshTokenCookie: (req, res) => {
        let cookies = req.headers['cookie']
        if (cookies) {
            var theCookieArr = cookies.split(/;\s?/)
            for (let i = 0; i < theCookieArr.length; i++) {
                let cookieKeyValue = theCookieArr[i].split('=')
                if (cookieKeyValue[0] === config.tokenCookieName) {
                    let tokenName = cookieKeyValue[0]
                    let tokenString = cookieKeyValue[1]
                    let maxAge = config.tokenMaxAge
                    let tokenCookie = `${tokenName}=${tokenString}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure`
                    res.setHeader('Set-Cookie', tokenCookie)
                }
            }
        }
    }
}

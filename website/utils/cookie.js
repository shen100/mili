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
    },
    getCookie: (key) => {
        let c = document.cookie || ''
        let cookies = c.split(';')
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i]
            cookie = cookie.replace(/^\s+/, '')
            let cookieArr = cookie.split('=')
            if (cookieArr[0] === key) {
                return cookieArr[1]
            }
        }
        return ''
    },
    setCookie: (key, value, day) => {
        day = day || 36500
        let expires = ''
        let date = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000)
        expires = '; expires=' + date.toUTCString()

        let cookie = [
            key + '=' + value,
            expires,
            '; path=/'
        ].join('')
        document.cookie = cookie
    }
}

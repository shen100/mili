import config from '~/config'

export default {
    shiftExpiration: (req, res) => {
        let cookies = req.headers['cookie']
        if (cookies) {
            var theCookieArr = cookies.split(/;\s?/)
            for (let i = 0; i < theCookieArr.length; i++) {
                let cookieKeyValue = theCookieArr[i].split('=')
                if (cookieKeyValue[0] === config.sessionName) {
                    let sessName = cookieKeyValue[0]
                    let sessID = cookieKeyValue[1]
                    let expire = new Date(Date.now() + config.sessionTimeout * 60 * 1000)
                    let expireStr = expire.toGMTString()
                    let sessCookie = `${sessName}=${sessID}; expires=${expireStr}; path=/; HttpOnly`
                    res.setHeader('Set-Cookie', sessCookie)
                }
            }
        }
    }
}

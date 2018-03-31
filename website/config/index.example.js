var config = {
    baiduAdURL: '//cpro.baidustatic.com/cpro/ui/c.js',
    apiURL: '/api',
    backApiURL: 'http://127.0.0.1:8023/api',
    useProxy: false,
    tokenCookieName: 'token',
    tokenMaxAge: 86400, // token多久过期，单位秒
    messageDuration: 5,
    sizeLimit: 3 * 1024 * 1024,
    sizeLimitTip: '3M',
    uploadURL: '/upload',
    uploadAvatar: '/user/uploadavatar',
    proxy: {
        host: '127.0.0.1',
        port: 8881
    }
}

config.uploadURL = config.apiURL + config.uploadURL
config.uploadAvatar = config.apiURL + config.uploadAvatar

module.exports = config

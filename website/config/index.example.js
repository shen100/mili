var config = {
    apiURL: '/api',
    backApiURL: 'http://127.0.0.1:8023/api',
    useProxy: false,
    sessionName: 'sessid', // 后台设置的session id
    sessionTimeout: 30, // session超时时间，单位分钟
    bdStatEnable: false,
    bdStatSI: '',
    messageDuration: 5,
    luosimaoSiteKey: '',
    proxy: {
        host: '127.0.0.1',
        port: 8881
    }
}

module.exports = config

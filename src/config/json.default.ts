import * as path from 'path';

export default {
    db: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: '',
        password: '',
        database: 'golang123',
        entities: [path.join(__dirname, '/../../src/entity/**/*.entity{.ts,.js}')],
        synchronize: false,
        logging: 'all', // query, error, schema, warn, info, log, all
        logger: 'simple-console',
        maxQueryExecutionTime: 500, // 单位毫秒
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
    },
    static: {
        cssPath: '/styles',
        jsPath: '/js',
        imgPath: '/images',
        fontPath: '/fonts',
        uploadImgURL: '',
        imgFormat: ['jpg', 'jpeg', 'png', 'gif'],
        imgMaxSize: 3,
        imgMaxSizeError: '图片大小不能超过%sM',
    },
    server: {
        siteName: '米粒',
        hostname: 'dev.golang123.com',
        mHostName: 'mdev.golang123.com',
        port: 8884,
        apiPrefix: '/api/v1',
        passSalt: 'u5o2law8xi',
        tokenName: 'token',
        tokenSecret: 'ema21ioirJikXIkLCJugmeiv',
        tokenMaxAge: 7 * 24 * 60 * 60 * 1000, // token多久过期，单位毫秒
        cookieSecret: 'aiwyskgun7cwimjq',
        csrfProtect: true,
        displayViewDataSecret: '1',
        rateLimitWindowMs: 15 * 60 * 1000, // 时间窗口，单位毫秒
        rateLimitMax: 1000, // limit each IP to rateLimitMax requests per windowMs
        swaggerPrefix: 'api/v1',
    },
    aliyunOSS: {
        accessKeyID: '',
        accessKeySecret: '',
        bucket: '',
        region: '',
        uploadActionURL: '',
        uploadPrefix: 'local', // 上传路径加个前缀
        uploadFieldName: 'file',
        expiration: 6, // 上传凭证过期时间, 单位小时
        imgMaxSize: 3, // 设置上传图片的大小限制, 单位M
        imgMaxSizeError: '图片大小要小于%sM', // 图片大小超过限制时的提示
    },
    aliyunSMS: {
        accessKeyID: '',
        accessKeySecret: '',
        signName: '',
        templateCode: '',
    },
    geetestCaptcha: {
        geetest_id: '',
        geetest_key: '',
    },
    github: {
        clientID: '',
        clientSecret: '',
        authorizeURL: 'https://github.com/login/oauth/authorize?scope=user&client_id=%s',
        accessTokenURL: 'https://github.com/login/oauth/access_token',
        userInfoURL: 'https://api.github.com/user?access_token=%s',
    },
    weibo: {
        appKey: '',
        appSecret: '',
        state: '', // 这个参数可用于防止跨站请求伪造（CSRF）攻击
        redirectURL: '',
        // tslint:disable-next-line:max-line-length
        authorizeURL: 'https://api.weibo.com/oauth2/authorize?state=%s&scope=email&client_id=%s&response_type=code&redirect_uri=%s',
        // tslint:disable-next-line:max-line-length
        accessTokenURL: 'https://api.weibo.com/oauth2/access_token?client_id=%s&client_secret=%s&grant_type=authorization_code&redirect_uri=%s&code=%s',
        userInfoURL: 'https://api.weibo.com/2/users/show.json?access_token=%s&uid=%s',
    },
};

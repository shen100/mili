import * as path from 'path';

const domain = 'dev.golang123.com';
const port = 9905;
const url = `http://${domain}`;
const mDomain = 'mdev.golang123.com';
const mURL = `http://${mDomain}`;

const staticURL = 'http://dev.golang123.com';

export default {
    db: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        charset: 'utf8mb4',
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
        staticURL,
        cssPath: `${staticURL}/styles`,
        jsPath: `${staticURL}/js`,
        imgPath: `${staticURL}/images`,
        fontPath: `${staticURL}/fonts`,
        uploadImgURL: '',
        imgFormat: ['jpg', 'jpeg', 'png', 'gif'],
        imgMaxSize: 3,
        imgMaxSizeError: '图片大小不能超过%sM',
        userLevelChapterURL: '/books/37/chapters/872', // 用户等级在《如何使用米粒社区》中的章节url
    },
    server: {
        siteName: '米粒',
        companyName: '',
        icp: '京ICP备12045181号-2',
        url,
        mURL,
        domain,
        mDomain,
        port,
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
        xiaoceEmail: '',
    },
    baiduAd: {
        ad250x250: '',
        ad580x90: '',
        ad580x90_2: '',
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
        callbackSecretToken: '123456789', // 用来验证是否是阿里云发过来的回调
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

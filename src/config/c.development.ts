const domain = 'dev.golang123.com';
const port = 9905;
const url = `http://${domain}:${port}`;
const mDomain = 'mdev.golang123.com';
const mURL = `http://${mDomain}:${port}`;

export default {
    db: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'test1234',
        database: 'mili',
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
        uploadImgURL: 'https://golang123-img.oss-cn-hangzhou.aliyuncs.com',
    },
    server: {
        url,
        domain,
        mDomain: 'mdev.golang123.com',
        port,
        apiPrefix: '/api/v1',
        passSalt: 'erjoe8qp',
        tokenName: 'token',
        tokenSecret: 'xma28i0irJiYXIkLCJuymeix',
        cookieSecret: 'yiwuskgu87wwiwjz',
        csrfProtect: false,
    },
    baiduAd: {
        ad250x250: 'u3382899',
        ad580x90: 'u3748022',
        ad580x90_2: 'u3748016',
    },
    aliyunOSS: {
        accessKeyID: 'LTAIheawpFed9efU',
        accessKeySecret: 'aKEyq3uKKxL855djqSo14quHaYskkc',
        bucket: 'golang123-img',
        region: 'oss-cn-hangzhou',
        uploadActionURL: 'https://golang123-img.oss-cn-hangzhou.aliyuncs.com',
        uploadPrefix: 'local', // 上传路径加个前缀
        expiration: 6, // 单位小时
    },
    aliyunSMS: {
        accessKeyID: 'LTAI2f2ODs208e6X',
        accessKeySecret: 'RUwRww4SF3H2Ky3Kvcv8rFypNAXbOg',
        signName: '众合教育',
        templateCode: 'SMS_91790030',
    },
    geetestCaptcha: {
        geetest_id: '0a78baa9af67918a3bee3eef8dd65afd',
        geetest_key: 'c7f4e017d0323fd4b66735099ae0c49d',
    },
    github: {
        clientID: 'a4632db4300453c7f0b6',
        clientSecret: '8dcf711f04d481cb41d0b33ad41d8eafa1b10930',
    },
    weibo: {
        appKey: '741219799',
        appSecret: '90d9a012b2aeab8f274db0a84913ceb2',
        state: 'fjodyao3sfaoiuioa29', // 这个参数可用于防止跨站请求伪造（CSRF）攻击
        redirectURL: `${url}/users/auth/weibo/callback.html`,
    },
};
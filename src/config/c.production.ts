import * as path from 'path';

const domain = 'www.golang123.com';
const port = 9905;
const url = `https://${domain}`;
const mDomain = 'm.golang123.com';
const mURL = `https://${mDomain}`;

const staticURL = 'https://static.golang123.com';

export default {
    db: {
        host: '10.81.66.187',
        port: 9601,
        username: 'root',
        password: 'gjrhu834u2i2io44u',
        entities: [path.join(__dirname, '/../../dist/entity/**/*.entity{.ts,.js}')],
        synchronize: false,
        logging: 'error', // boolean | query, error, schema, warn, info, log, all
        logger: 'simple-console',
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
        // img.golang123.com 用来存放用户上传的图片
        uploadImgURL: 'https://img.golang123.com',
        userLevelChapterURL: '/books/37/chapters/872', // 用户等级在《如何使用米粒社区》中的章节url
    },
    statsD: {
        host: 'localhost',
        port: 8125,
    },
    server: {
        companyName: '北京xxxxxxx有限公司',
        url,
        mURL,
        domain,
        mDomain,
        port,
        passSalt: 'erjoe8qp',
        tokenName: 'token',
        tokenSecret: 'Jmb28iOirJiYXIiLCJuYmYix',
        cookieSecret: 'yiwuskgu87wwiwjz',
        displayViewDataSecret: 'ykmtjeury7euew1oa6zxu2we',
        xiaoceEmail: 'xiaoce@golang123.com',
    },
    aliyunOSS: {
        accessKeyID: 'LTAIheawpFed9efU',
        accessKeySecret: 'aKEyq3uKKxL855djqSo14quHaYskkc',
        bucket: 'golang123-img',
        region: 'oss-cn-hangzhou',
        uploadActionURL: 'https://golang123-img.oss-cn-hangzhou.aliyuncs.com',
        uploadPrefix: 'upload/img', // 上传路径加个前缀
        expiration: 6, // 单位小时
        callbackSecretToken: 'c6e42824eb44b6971017f3e',
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
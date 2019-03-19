import * as _ from 'lodash';
import defaultJSON from './json.default';
import developmentJSON from './json.development';
import testJSON from './json.test';
import stagingJSON from './json.staging';
import productionJSON from './json.production';
import { Logger } from 'typeorm/logger/Logger';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

class BaseConfig {
    constructor(cfg) {
        for (const key of Object.keys(cfg)) {
            this[key] = cfg[key];
        }
    }
}

class DBConfig extends BaseConfig {
    readonly type: 'mysql' | 'mariadb';
    readonly host: string;
    readonly port: number;
    readonly username: string;
    readonly password: string;
    readonly database: string;
    readonly entities: string[];
    readonly synchronize: boolean;
    readonly logging: LoggerOptions;
    readonly logger: 'advanced-console' | 'simple-console' | 'file' | 'debug' | Logger;
    // If query execution time exceed this given max execution time (in milliseconds) then logger will log this query.
    readonly maxQueryExecutionTime: number;

    constructor(cfg) {
        super(cfg);
    }
}

class RedisConfig extends BaseConfig {
    readonly host: string;
    readonly port: number;

    constructor(cfg) {
        super(cfg);
    }
}

class StaticConfig extends BaseConfig {
    readonly cssPath: string; // css路径
    readonly jsPath: string; // js路径
    readonly imgPath: string; // 图片路径
    readonly fontPath: string; // 字体路径
    readonly uploadImgURL: string;
    readonly imgFormat: string;
    readonly imgMaxSize: number; // 设置上传图片的大小限制, 单位M
    readonly imgMaxSizeError: number; // 图片大小超过限制时的提示

    constructor(cfg) {
        super(cfg);
    }
}

class ServerConfig extends BaseConfig {
    readonly siteName: string;
    readonly hostname: string;
    readonly port: number;
    readonly apiPrefix: string;
    readonly passSalt: string;
    readonly tokenName: string;
    readonly tokenSecret: string;
    readonly tokenMaxAge: number;
    readonly cookieSecret: string;
    readonly csrfProtect: boolean;
    readonly displayViewDataSecret: string;
    readonly rateLimitWindowMs: number; // 时间窗口，单位毫秒
    readonly rateLimitMax: number; // limit each IP to rateLimitMax requests per windowMs
    readonly swaggerPrefix: string;

    constructor(cfg) {
        super(cfg);
    }
}

class AliyunOSSConfig extends BaseConfig {
    readonly accessKeyID: string;
    readonly accessKeySecret: string;
    readonly bucket: string;
    readonly region: string;
    readonly uploadActionURL: string;
    readonly uploadPrefix: string; // 本地开发时，上传路径加个前缀
    readonly uploadFieldName: string;
    readonly expiration: number; // 设置Policy的失效时间, 单位小时

    constructor(cfg) {
        super(cfg);
    }
}

class AliyunSMSConfig extends BaseConfig {
    readonly accessKeyID: string;
    readonly accessKeySecret: string;
    readonly signName: string;
    readonly templateCode: string;

    constructor(cfg) {
        super(cfg);
    }
}

class GeetestCaptcha extends BaseConfig {
    readonly geetest_id: string;
    readonly geetest_key: string;

    constructor(cfg) {
        super(cfg);
    }
}

class Github extends BaseConfig {
    readonly clientID: string;
    readonly clientSecret: string;
    readonly accessTokenURL: string;
    readonly userInfoURL: string;
    readonly authorizeURL: string;

    constructor(cfg) {
        super(cfg);
    }
}

class Weibo extends BaseConfig {
    readonly appKey: string;
    readonly appSecret: string;
    readonly state: string;
    readonly redirectURL: string;
    readonly authorizeURL: string;
    readonly accessTokenURL: string;
    readonly userInfoURL: string;
}

export class ConfigService {
    readonly DEVELOPMENT = 'development';
    readonly TEST = 'test';
    readonly STAGING = 'staging';
    readonly PRODUCTION = 'production';

    readonly env: string;
    readonly db: DBConfig;
    readonly redis: RedisConfig;
    readonly server: ServerConfig;
    readonly static: StaticConfig;
    readonly aliyunOSS: AliyunOSSConfig;
    readonly aliyunSMS: AliyunSMSConfig;
    readonly geetestCaptcha: GeetestCaptcha;
    readonly github: Github;
    readonly weibo: Weibo;

    constructor() {
        const envConfigMap = {
            development: developmentJSON,
            test: testJSON,
            staging: stagingJSON,
            production: productionJSON,
        };
        if (envConfigMap[process.env.NODE_ENV]) {
            _.merge(defaultJSON, envConfigMap[process.env.NODE_ENV]);
            this.env = process.env.NODE_ENV;
        } else {
            this.env = this.DEVELOPMENT;
        }
        this.db = new DBConfig(defaultJSON.db);
        if (this.env !== this.DEVELOPMENT && this.db.synchronize) {
            process.exit(-1);
        }
        this.redis = new RedisConfig(defaultJSON.redis);
        this.server = new ServerConfig(defaultJSON.server);
        this.static = new StaticConfig(defaultJSON.static);
        this.aliyunOSS = new AliyunOSSConfig(defaultJSON.aliyunOSS);
        this.aliyunSMS = new AliyunSMSConfig(defaultJSON.aliyunSMS);
        this.geetestCaptcha = new GeetestCaptcha(defaultJSON.geetestCaptcha);
        this.github = new Github(defaultJSON.github);
        this.weibo = new Weibo(defaultJSON.weibo);
    }
}
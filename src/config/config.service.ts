import * as _ from 'lodash';
import defaultJSON from './cfg.default';
import developmentJSON from './cfg.development';
import testJSON from './cfg.test';
import productionJSON from './cfg.production';
import DBConfig from './type/DBConfig';
import StatsDConfig from './type/StatsDConfig';
import { ServerConfig } from './type/ServerConfig';
import StaticConfig from './type/StaticConfig';
import AliyunOSSConfig from './type/AliyunOSSConfig';
import AliyunSMSConfig from './type/AliyunSMSConfig';
import GeetestCaptcha from './type/GeetestCaptcha';
import WeiboConfig from './type/WeiboConfig';
import GithubConfig from './type/GithubConfig';
import RedisConfig from './type/RedisConfig';

export class ConfigService {
    readonly DEVELOPMENT = 'development';
    readonly TEST = 'test';
    readonly PRODUCTION = 'production';

    readonly env: string;
    readonly db: DBConfig;
    readonly redis: RedisConfig;
    readonly statsD: StatsDConfig;
    readonly server: ServerConfig;
    readonly static: StaticConfig;
    readonly aliyunOSS: AliyunOSSConfig;
    readonly aliyunSMS: AliyunSMSConfig;
    readonly geetestCaptcha: GeetestCaptcha;
    readonly github: GithubConfig;
    readonly weibo: WeiboConfig;

    constructor() {
        const envConfigMap = {
            development: developmentJSON,
            test: testJSON,
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
        this.statsD = new StatsDConfig(defaultJSON.statsD);
        this.server = new ServerConfig(defaultJSON.server);
        this.static = new StaticConfig(defaultJSON.static);
        this.aliyunOSS = new AliyunOSSConfig(defaultJSON.aliyunOSS);
        this.aliyunSMS = new AliyunSMSConfig(defaultJSON.aliyunSMS);
        this.geetestCaptcha = new GeetestCaptcha(defaultJSON.geetestCaptcha);
        this.github = new GithubConfig(defaultJSON.github);
        this.weibo = new WeiboConfig(defaultJSON.weibo);
    }
}

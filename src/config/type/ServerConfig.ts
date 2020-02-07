import BaseConfig from './BaseConfig';

export class ServerConfig extends BaseConfig {
    readonly siteName: string;
    readonly companyName: string;
    readonly icp: string;
    readonly url: string;
    readonly mURL: string;
    readonly domain: string;
    readonly mDomain: string;
    readonly allowOrigins: string[];
    readonly port: number;
    readonly apiPrefix: string;
    readonly passSalt: string;
    readonly tokenName: string;
    readonly tokenSecret: string;
    readonly tokenMaxAge: number;
    readonly cookieSecret: string;
    readonly rateLimitWindowMs: number; // 时间窗口，单位毫秒
    readonly rateLimitMax: number; // limit each IP to rateLimitMax requests per windowMs
    readonly swaggerPrefix: string;
    readonly xiaoceEmail: string;

    constructor(cfg) {
        super(cfg);
    }
}
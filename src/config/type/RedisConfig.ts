import BaseConfig from './BaseConfig';

export default class RedisConfig extends BaseConfig {
    readonly host: string;
    readonly port: number;
    readonly keyPrefix: string;

    constructor(cfg) {
        super(cfg);
        this.keyPrefix = process.env.MILI_REDIS_PREFIX || this.keyPrefix;
    }
}
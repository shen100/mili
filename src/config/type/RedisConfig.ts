import BaseConfig from './BaseConfig';

export default class RedisConfig extends BaseConfig {
    readonly host: string;
    readonly port: number;
    readonly prefix: string;

    constructor(cfg) {
        super(cfg);
        this.prefix = process.env.REDIS_PREFIX || this.prefix;
    }
}
import BaseConfig from './BaseConfig';

export default class AliyunSMSConfig extends BaseConfig {
    readonly accessKeyID: string;
    readonly accessKeySecret: string;
    readonly signName: string;
    readonly templateCode: string;

    constructor(cfg) {
        super(cfg);
    }
}
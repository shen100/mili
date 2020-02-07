import BaseConfig from './BaseConfig';

export default class AliyunOSSConfig extends BaseConfig {
    readonly accessKeyID: string;
    readonly accessKeySecret: string;
    readonly bucket: string;
    readonly region: string;
    readonly uploadActionURL: string;
    readonly uploadPrefix: string; // 本地开发时，上传路径加个前缀
    readonly uploadFieldName: string;
    readonly expiration: number; // 设置Policy的失效时间, 单位小时
    readonly callbackSecretToken: string;

    constructor(cfg) {
        super(cfg);
    }
}
import BaseConfig from './BaseConfig';

export default class WeiboConfig extends BaseConfig {
    readonly appKey: string;
    readonly appSecret: string;
    readonly state: string;
    readonly redirectURL: string;
    readonly authorizeURL: string;
    readonly accessTokenURL: string;
    readonly userInfoURL: string;

    private serverURL: string;

    constructor(cfg) {
        super(cfg);
        this.redirectURL = this.serverURL + this.redirectURL;
    }
}
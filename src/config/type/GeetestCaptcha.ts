import BaseConfig from './BaseConfig';

export default class GeetestCaptcha extends BaseConfig {
    readonly geetest_id: string;
    readonly geetest_key: string;

    constructor(cfg) {
        super(cfg);
    }
}
import BaseConfig from './BaseConfig';

export default class GeetestCaptcha extends BaseConfig {
    readonly geetest_id: string;
    readonly geetest_key: string;
    readonly disabled: boolean;

    constructor(cfg) {
        super(cfg);
        this.disabled = !(this.geetest_id && this.geetest_key);
    }
}
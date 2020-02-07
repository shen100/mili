export default class BaseConfig {
    constructor(cfg) {
        for (const key of Object.keys(cfg)) {
            this[key] = cfg[key];
        }
    }
}
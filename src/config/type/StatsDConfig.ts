import BaseConfig from './BaseConfig';

export default class StatsDConfig extends BaseConfig {
    readonly host: string;
    readonly port: number;
    readonly prefix: string;
    readonly telegraf: boolean;
    readonly protocol: 'tcp' | 'udp' | 'uds';

    constructor(cfg) {
        super(cfg);
    }
}
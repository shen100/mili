import BaseConfig from './BaseConfig';
import { Logger } from 'typeorm/logger/Logger';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

export default class DBConfig extends BaseConfig {
    readonly type: 'mysql' | 'mariadb';
    readonly host: string;
    readonly port: number;
    readonly username: string;
    readonly password: string;
    readonly database: string;
    readonly entities: string[];
    readonly synchronize: boolean;
    readonly logging: LoggerOptions;
    readonly logger: 'advanced-console' | 'simple-console' | 'file' | 'debug' | Logger;
    // If query execution time exceed this given max execution time (in milliseconds) then logger will log this query.
    readonly maxQueryExecutionTime: number;

    constructor(cfg) {
        super(cfg);
        this.database = process.env.MILI_MYSQL_DB || this.database;
        this.username = process.env.MILI_MYSQL_USER || this.username;
        this.password = process.env.MILI_MYSQL_PASSWORD || this.password;
    }
}
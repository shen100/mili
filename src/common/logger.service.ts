import * as pino from 'pino';
import * as moment from 'moment';

const logger = pino();

class LogData {
    public message?: string;
    public data?: any;
}

export class MyLoggerService {

    private writeLog(logMethod: string, logData: LogData) {
        logData = logData || { message: '', data: {} };
        (logData as any).timeLocal = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        logger[logMethod](logData);
    }

    debug(logData: LogData) {
        this.writeLog('debug', logData);
    }

    info(logData: LogData) {
        this.writeLog('info', logData);
    }

    error(logData: LogData) {
        this.writeLog('error', logData);
    }

    warn(logData: LogData) {
        this.writeLog('warn', logData);
    }

    fatal(logData: LogData) {
        this.writeLog('fatal', logData);
    }
}
import * as bluebird from 'bluebird';
import { Injectable, NestInterceptor, ExecutionContext, HttpStatus, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';
import { MyLoggerService } from '../../logger/logger.service';
import { ErrorCode } from '../../config/constants';

@Injectable()
export class TransformResInterceptor<T> implements NestInterceptor {

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MyLoggerService,
    ) {}

    intercept(
        context: ExecutionContext,
        call$: Observable<T>,
    ): Observable<any> {
        return call$.pipe(map(async (data) => {
            if (typeof data === 'undefined') {
                return data;
            }
            const newData = data as any;

            const req = context.switchToHttp().getRequest();
            // if (req.query && req.query.json === this.configService.server.viewDataSecret) {
            //     return newData;
            // }

            if (typeof newData.statusCode === 'undefined') {
                return {
                    data: newData,
                    errorCode: ErrorCode.SUCCESS.CODE,
                    message: 'success',
                };
            }
            let errorCode, message;
            if (ErrorCode.HasCode(newData.statusCode)) {
                errorCode = newData.statusCode;
                message = ErrorCode.CodeToMessage(errorCode);
            } else {
                errorCode = ErrorCode.ERROR.CODE;
                message = ErrorCode.ERROR.MESSAGE;
            }
            return {
                errorCode,
                message,
                data: this.configService.env === this.configService.DEVELOPMENT ? {
                    nestjs: newData.message,
                } : null,
            };
        }));
    }
}

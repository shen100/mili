import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../constants/error';
import { MyLoggerService } from '../../common/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MyLoggerService,
    ) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const nestjsMessage = exception.message;
        let message;
        let errorCode: number;

        if (exception.code === 'EBADCSRFTOKEN') {
            response.status(HttpStatus.FORBIDDEN).json({
                errorCode: ErrorCode.Forbidden.CODE,
                message: 'invalid csrf token',
            });
            return;
        } else if (exception.getStatus) { // http exception
            const httpException: HttpException = exception as HttpException;
            if (httpException.message && typeof httpException.message.errorCode !== 'undefined') {
                errorCode = httpException.message.errorCode;
                message = httpException.message.message || ErrorCode.CodeToMessage(errorCode);
            } else {
                const statusCode = httpException.getStatus();
                if (ErrorCode.HasCode(statusCode)) {
                    message = ErrorCode.CodeToMessage(statusCode);
                } else {
                    errorCode = ErrorCode.ERROR.CODE;
                    message = ErrorCode.ERROR.MESSAGE;
                }
            }
        } else {
            // 报错抛出的Error
            errorCode = ErrorCode.ERROR.CODE;
            message = ErrorCode.ERROR.MESSAGE;
            this.logger.error({
                message: [ exception.message, exception.stack ].join('\n'),
            });
        }
        const apiPrefix = this.configService.server.apiPrefix;
        if (errorCode === ErrorCode.LoginTimeout.CODE && request.originalUrl.indexOf(apiPrefix) !== 0) {
            const redirectURL = encodeURIComponent(request.originalUrl);
            let url = '/signin';
            if (redirectURL) {
                url = `${url}?miliref=${redirectURL}`;
            }
            response.redirect(url);
            return;
        }
        response.status(HttpStatus.OK).json({
            errorCode,
            message,
            data: this.configService.env === this.configService.DEVELOPMENT ? {
                nestjs: nestjsMessage,
            } : null,
        });
    }
}
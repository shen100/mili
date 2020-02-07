import * as url from 'url';
import * as csurf from 'csurf';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { APIPrefix } from '../../constants/constants';
import { MyLoggerService } from '../../common/logger.service';
import { MyRequest } from '../types/net';

const csrfProtection = csurf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

@Injectable()
export class CSRFMiddleware implements NestMiddleware {
    constructor(
        private readonly logger: MyLoggerService,
    ) {}

    use(request: Request, response: Response, next: () => void) {
        const req: any = request;
        const res: any = response;

        const pathname = url.parse(req.originalUrl).pathname;
        const trustArr = [
            `${APIPrefix}/common/oss/callback`,
        ];
        if (trustArr.indexOf(pathname) >= 0) {
            next();
            return;
        }
        csrfProtection(req, res, next);
    }
}
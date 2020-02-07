import * as requestIp from 'request-ip';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MyLoggerService } from '../../common/logger.service';
import { MyRequest } from '../types/net';

@Injectable()
export class IpMiddleware implements NestMiddleware {
    constructor(
        private readonly logger: MyLoggerService,
    ) {}

    use(request: Request, response: Response, next: () => void) {
        const req: MyRequest = request as any;
        req.reqStartTime = Date.now();

        const clientIp = requestIp.getClientIp(request as any);
        (request as any).clientIp = clientIp;

        this.logger.info({
            data: {
                middleware: 'IpMiddleware',
                ip: clientIp,
                req: {
                    method: 'GET',
                    url: req.originalUrl,
                    headers: {
                        'user-agent': req.headers['user-agent'],
                    },
                },
            },
        });
        next();
    }
}
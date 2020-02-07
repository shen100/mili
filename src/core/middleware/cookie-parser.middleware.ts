import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { MyLoggerService } from '../../common/logger.service';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
    private cookieParser: any;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MyLoggerService,
    ) {
        this.cookieParser = cookieParser(this.configService.server.cookieSecret);
    }

    use(request: Request, response: Response, next: () => void) {
        const req: any = request;
        const res: any = response;

        this.cookieParser(req, res, next);
    }
}
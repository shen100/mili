import { Injectable, NestMiddleware } from '@nestjs/common';
import * as helmet from 'helmet';
import { MyLoggerService } from '../../common/logger.service';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
    private helmet: any;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MyLoggerService,
    ) {
        this.helmet = helmet();
    }

    use(request: Request, response: Response, next: () => void) {
        const req: any = request;
        const res: any = response;

        this.helmet(req, res, next);
    }
}
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as compression from 'compression';
import { MyLoggerService } from '../../common/logger.service';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
    private compression: any;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MyLoggerService,
    ) {
        this.compression = compression();
    }

    use(request: Request, response: Response, next: () => void) {
        const req: any = request;
        const res: any = response;

        this.compression(req, res, next);
    }
}
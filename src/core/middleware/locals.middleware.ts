import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class LocalsMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    resolve(): MiddlewareFunction {
        return (req, res, next) => {
            const configService = this.configService;
            res.locals.env = configService.env;
            res.locals.siteName = configService.server.siteName;
            res.locals.apiPrefix = configService.server.apiPrefix,
            res.locals.reqPath = req.originalUrl,
            res.locals.cssPath = configService.static.cssPath;
            res.locals.jsPath = configService.static.jsPath;
            res.locals.imgPath = configService.static.imgPath;
            res.locals.fontPath = configService.static.fontPath;
            res.locals.baiduAd = configService.baiduAd;
            res.locals.globalConfig = {
                hostname: configService.server.hostname,
                mHostName: configService.server.mHostName,
                csrfToken: configService.server.csrfProtect ? req.csrfToken() : '',
                apiPrefix: configService.server.apiPrefix,
                imgPath: configService.static.imgPath,
                jsPath: configService.static.jsPath,
                cssPath: configService.static.cssPath,
            };
            next();
        };
    }
}
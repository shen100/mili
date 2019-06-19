import { Injectable, NestMiddleware, } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class LocalsMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    use(request: Request, response: Response, next: Function) {
        const req: any = request;
        const res: any = response;
        const configService = this.configService;
        res.locals.env = configService.env;
        res.locals.siteName = configService.server.siteName;
        res.locals.apiPrefix = configService.server.apiPrefix,
        res.locals.reqPath = req.originalUrl,
        res.locals.staticURL = configService.static.staticURL;
        res.locals.cssPath = configService.static.cssPath;
        res.locals.jsPath = configService.static.jsPath;
        res.locals.imgPath = configService.static.imgPath;
        res.locals.fontPath = configService.static.fontPath;
        res.locals.baiduAd = configService.baiduAd;
        res.locals.globalConfig = {
            url: configService.server.url,
            mURL: configService.server.mURL,
            domain: configService.server.domain,
            mDomain: configService.server.mDomain,
            csrfToken: configService.server.csrfProtect ? req.csrfToken() : '',
            apiPrefix: configService.server.apiPrefix,
            imgPath: configService.static.imgPath,
            jsPath: configService.static.jsPath,
            cssPath: configService.static.cssPath,
        };
        next();
    }
}
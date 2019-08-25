import { ConfigService } from './config/config.service';
import * as helmet from 'helmet';
import { TransformResInterceptor } from './core/interceptors/transform-res.interceptor';
import { MyLoggerService } from './common/logger.service';
import { GlobalExceptionFilter } from './core/filters/global-exceptoin.filter';
import { ValidateDtoPipe } from './core/pipes/validate-dto.pipe';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as viewfilter from './utils/viewfilter';

export default async function bootstrap(app, listening: boolean = true) {
    const myLoggerService: MyLoggerService = app.get(MyLoggerService);
    const configService: ConfigService = app.get(ConfigService);

    const viewPath = path.join(__dirname, '../views');
    app.setBaseViewsDir(viewPath);
    app.setViewEngine('njk');
    const nunjucksEnv = nunjucks.configure(viewPath, {
        noCache: process.env.NODE_ENV === configService.DEVELOPMENT,
        autoescape: true,
        express: app,
    });
    for (const key of Object.keys(viewfilter)) {
        nunjucksEnv.addFilter(key, viewfilter[key]);
    }
    // macro中不能访问当前 context , 将要访问的变量加到 global
    nunjucksEnv.addGlobal('env', configService.env);
    nunjucksEnv.addGlobal('jsPath', configService.static.jsPath);

    app.use(rateLimit({
        windowMs: configService.server.rateLimitWindowMs,
        max: configService.server.rateLimitMax,
    }));
    app.useLogger(myLoggerService);
    app.use(helmet());
    app.use(compression());
    app.useGlobalPipes(new ValidateDtoPipe(configService));
    app.useGlobalInterceptors(new TransformResInterceptor(configService, myLoggerService));
    app.useGlobalFilters(new GlobalExceptionFilter(configService, myLoggerService));

    if (listening) {
        await app.listen(configService.server.port);
    }
}
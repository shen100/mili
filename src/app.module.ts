import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { CMSModule } from './cms/cms.module';
import { UserMiddleware } from './core/middleware/user.middleware';
import { CommonModule } from './common/common.module';
import { StatsModule } from './stats/stats.module';
import * as csurf from 'csurf';
import { PreRequestMiddleware } from './core/middleware/prereq.middleware';
import { BoilingPointModule } from './boilingpoint/boilingpoint.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                // typeorm bug, https://github.com/nestjs/nest/issues/1119
                // 将 type 定义为 type: 'mysql' | 'mariadb'; 解决此issue
                return configService.db;
            },
            inject: [ ConfigService ],
        }),
        RedisModule.forRootAsync({
            useFactory: async (configService: ConfigService): Promise<ConfigService> => {
                return configService;
            },
            inject: [ ConfigService ],
        }),
        CommonModule,
        UserModule,
        CMSModule,
        BoilingPointModule,
        StatsModule,
        AdminModule,
    ],
})
export class AppModule implements NestModule {
    constructor(private readonly configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        CookieParserMiddleware.configure(this.configService.server.cookieSecret);
        let localsMiddlewares: Array<any> = [
            CookieParserMiddleware,
        ];
        if (this.configService.server.csrfProtect) {
            localsMiddlewares.push(csurf({
                cookie: true,
                ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
            }));
        }
        localsMiddlewares = localsMiddlewares.concat([
            PreRequestMiddleware,
            UserMiddleware,
        ]);
        consumer
            .apply(...localsMiddlewares)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}

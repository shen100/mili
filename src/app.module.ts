import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { SocketModule } from './socket/socket.module';
import { RedisModule } from './redis/redis.module';
import { CMSModule } from './cms/cms.module';
import { UserMiddleware } from './common/middleware/user.middleware';
import { LoggerModule } from './logger/logger.module';
import { StatsModule } from './stats/stats.module';
import * as csurf from 'csurf';
import { LocalsMiddleware } from './common/middleware/locals.middleware';

@Module({
    imports: [
        LoggerModule,
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
        UserModule,
        SocketModule,
        CMSModule,
        StatsModule,
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
            LocalsMiddleware,
            UserMiddleware,
        ]);
        consumer
            .apply(...localsMiddlewares)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}

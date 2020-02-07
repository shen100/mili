import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { CMSModule } from './cms/cms.module';
import { UserMiddleware } from './core/middleware/user.middleware';
import { CommonModule } from './common/common.module';
import { StatsModule } from './stats/stats.module';
import { LocalsMiddleware } from './core/middleware/locals.middleware';
import { BoilingPointModule } from './boilingpoint/boilingpoint.module';
import { AdminModule } from './admin/admin.module';
import { BookModule } from './book/book.module';
import { CorsMiddleware } from './core/middleware/cors.middleware';
import { CSRFMiddleware } from './core/middleware/csrf.middleware';
import { ExerciseModule } from './exercise/exercise.module';
import { IpMiddleware } from './core/middleware/ip.middleware';
import { HelmetMiddleware } from './core/middleware/helmet.middleware';
import { RateLimitMiddleware } from './core/middleware/rate-limit.middleware';
import { CompressionMiddleware } from './core/middleware/compression.middleware';
import { CookieParserMiddleware } from './core/middleware/cookie-parser.middleware';

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
        BookModule,
        BoilingPointModule,
        ExerciseModule,
        StatsModule,
        AdminModule,
    ],
})
export class AppModule implements NestModule {
    constructor(private readonly configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        const middlewares = [
            IpMiddleware,
            CookieParserMiddleware,
            RateLimitMiddleware,
            CorsMiddleware,
            CSRFMiddleware,
            HelmetMiddleware,
            UserMiddleware,
            LocalsMiddleware,
            CompressionMiddleware,
        ];
        consumer
            .apply(...middlewares)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}

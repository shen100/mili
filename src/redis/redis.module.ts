import { Global, Module, DynamicModule } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigService } from '../config/config.service';

@Global()
@Module({})
export class RedisModule {
    static forRootAsync(options): DynamicModule {
        const providers = [
            {
                provide: 'RedisModuleOptions',
                useFactory: options.useFactory,
                inject: options.inject,
            },
            {
                provide: RedisService,
                useFactory: (configService: ConfigService) => {
                    return new RedisService(configService);
                },
                inject: ['RedisModuleOptions'],
            },
        ];

        return {
            module: RedisModule,
            providers,
            exports: providers,
        };
    }
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bootstrap from './bootstrap';
import { Logger } from '@nestjs/common';

async function main() {
    const app = await NestFactory.create(AppModule, {
        logger: process.env.NODE_ENV === 'development' ? new Logger() : false,
    });
    await bootstrap(app);
}

main();
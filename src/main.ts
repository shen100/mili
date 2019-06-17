import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bootstrap from './bootstrap';

async function main() {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    const app = await NestFactory.create(AppModule, {
        logger: false,
    });
    await bootstrap(app);
}

main();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bootstrap from './bootstrap';

declare const module: any;

async function main() {
    const app = await NestFactory.create(AppModule, {
        logger: false,
    });
    await bootstrap(app);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

main();
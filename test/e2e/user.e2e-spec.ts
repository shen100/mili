import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import bootstrap from './../../src/bootstrap';
import * as assert from 'assert';
import { ConfigService } from '../../src/config/config.service';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let configService: ConfigService;
    const userID = 44;

    function getURL(url) {
        return configService.server.apiPrefix + url;
    }

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        configService = app.get(ConfigService);
        await bootstrap(app, false);
        await app.init();
    });

    it('/public/:id (GET)', () => {
        return request(app.getHttpServer())
            .get(getURL(`/users/public/${userID}`))
            .set('Accept', 'application/json')
            .then((res) => {
                assert(res.body, 'body should not be null');
                const body = res.body;
                assert(body.errNo === 0, `errNo should equal 0 (${body.errNo})`);
                assert(body.data, `body.data should not be null`);
                assert(body.data.user, `body.data.user should not be null`);
                assert(body.data.user.id === userID, `body.data.user.id should equal (${userID})`);
                assert(body.data.user.name, `body.data.user.name should not be null (${body.data.user.name})`);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
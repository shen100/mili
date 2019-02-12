import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import bootstrap from './../../src/bootstrap';
import * as assert from 'assert';
import { ConfigService } from '../../src/config/config.service';

describe('ArticleController (e2e)', () => {
    let app: INestApplication;
    let configService: ConfigService;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDR9.j2dVrOZ3qjK8sQ5gw2CtCSJp65WEmSTRVfhSOnMg6Vo';

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

    it('/articles (POST)', () => {
        return request(app.getHttpServer())
            .post(getURL('/articles'))
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send({
                name: '测试标题2222',
                content: '测试文章内容',
                contentType: 1,
                categories: [
                    {
                        id: 2,
                    },
                    {
                        id: 3,
                    },
                ],
            })
            .then((res) => {
                assert(res.body.errNo === 0, `errNo should equal 0 (${res.body.errNo})`);
                assert(res.body.data && res.body.data.id > 0, `body.data.id should > 0 (${res.body.data.id})`);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
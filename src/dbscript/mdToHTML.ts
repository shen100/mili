import { createConnection } from 'typeorm';
import { Article } from '../entity/article.entity';
import { ConfigService } from '../config/config.service';
import * as marked from 'marked';
import * as striptags from 'striptags';

const config = new ConfigService();

let errCount = 0;

const summaryLenth = 500;
const summaryStripLenth = 100;

(async function run() {
    const connection = await createConnection(config.db);
    const articleRepository = connection.getRepository(Article);

    try {
        // await connection.manager.query(`alter table users change signature introduce varchar(500)`);
        // await connection.manager.query(`alter table articles add column summary varchar(${summaryLenth})`);
        // await connection.manager.query(`alter table articles add column like_count int default 0`);
        // await connection.manager.query(`alter table articles add column word_count int default 0`);
        // await connection.manager.query(`alter table articles add column hot int default 0`);
        await connection.manager.query(`alter table articles add column comment_enabled tinyint(1) NOT NULL DEFAULT '1'`);
        await connection.manager.query(`alter table articles add column cover_url varchar(500) DEFAULT NULL`);

        return ;

        const articles = await articleRepository.find({
            select: {
                id: true,
                content: true,
                htmlContent: true,
                contentType: true,
            },
        });

        articles.forEach(async (article) => {
            let html;
            const updateData: any = {};
            if (article.contentType === 1) {
                html = marked(article.content);
                updateData.htmlContent = html;
            } else {
                html = article.htmlContent;
            }
            let summary = striptags(html);
            summary = summary.replace(/^\s+|\s+$/g, '');
            summary = summary.replace(/\s+|\n$/g, ' ');
            updateData.wordCount = summary.length;
            summary = summary.substr(0, summaryStripLenth);
            updateData.summary = summary;
            await articleRepository.update({
                id: article.id,
            }, updateData);

            // tslint:disable-next-line:no-console
            console.log('articles.length:', articles.length);
            // tslint:disable-next-line:no-console
            console.log('errCount', errCount);
        });
    } catch (error) {
        errCount++;
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        // tslint:disable-next-line:no-console
        console.log('errCount: ', errCount);
        process.exit(-1);
    }
}());
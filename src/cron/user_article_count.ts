/**
 * 分别统计每一个用户发表的文章数，每一个用户的文章阅读数
 */

import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { MyLoggerService } from '../common/logger.service';

const config = new ConfigService();
const logger = new MyLoggerService();

async function queryUserArticleCount(connection): Promise<{user_id: number, article_count: string}[]> {
    const sql = `
        select user_id, count(*) as article_count from articles
        group by user_id
    `;
    return await connection.manager.query(sql);
}

async function queryUserArticleViewCount(connection): Promise<{user_id: number, article_view_count: string}[]> {
    const sql = `
        select user_id, sum(browse_count) as article_view_count from articles
        group by user_id
    `;
    return await connection.manager.query(sql);
}

async function updateUserArticleCount(connection, userMap: { [user_id: number]: { article_count: number, article_view_count: number } }) {
    const articleCountSQLArr: string[] = ['update users set article_count = case id '];
    const articleCountParams: number[] = [];
    const articleViewCountSQLArr: string[] = [', article_view_count = case id '];
    const articleViewCountParams: number[] = [];
    for (const key of Object.keys(userMap)) {
        const user_id = parseInt(key, 10);
        articleCountSQLArr.push('when ? then ?');
        articleCountParams.push(...[ user_id, userMap[user_id].article_count ]);

        articleViewCountSQLArr.push('when ? then ?');
        articleViewCountParams.push(...[ user_id, userMap[user_id].article_view_count ]);
    }
    articleCountSQLArr.push('else 0 end');
    articleViewCountSQLArr.push('else 0 end');
    const sqlArr = articleCountSQLArr.concat(articleViewCountSQLArr);
    const params = articleCountParams.concat(articleViewCountParams);
    await connection.manager.query(sqlArr.join(' '), params);
}

(async function run() {
    const connection = await createConnection(config.db);
    const [ articleCountArr, articleViewCountArr ] = await Promise.all([
        queryUserArticleCount(connection),
        queryUserArticleViewCount(connection),
    ]);

    const userMap: { [user_id: number]: { article_count: number, article_view_count: number } } = {};
    articleCountArr.forEach(data => {
        userMap[data.user_id] = userMap[data.user_id] || { article_count: 0, article_view_count: 0 };
        userMap[data.user_id].article_count = parseInt(data.article_count, 10) || 0;
    });

    articleViewCountArr.forEach(data => {
        userMap[data.user_id] = userMap[data.user_id] || { article_count: 0, article_view_count: 0 };
        userMap[data.user_id].article_view_count = parseInt(data.article_view_count, 10) || 0;
    });

    await updateUserArticleCount(connection, userMap);

    logger.info({ message: '[cron] user_article_count done' });

    process.exit(0);
}());
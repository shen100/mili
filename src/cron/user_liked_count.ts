/**
 * 分别统计每一个用户获得的点赞数
 */

import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { MyLoggerService } from '../common/logger.service';

const config = new ConfigService();
const logger = new MyLoggerService();

async function queryUserLikedCount(connection, table: string): Promise<{user_id: number, liked_count: number}[]> {
    const sql = `
        select publisher as user_id, count(*) as liked_count from ${table}
        group by publisher
    `;
    let result = await connection.manager.query(sql);
    result = result || [];
    return result.map(data => {
        return {
            user_id: data.user_id,
            liked_count: parseInt(data.liked_count, 10),
        };
    });
}

async function updateUserLikedCount(connection, userMap: { [user_id: number]: number }) {
    const sqlArr = ['update users set liked_count = case id '];
    const params = [];
    for (const user_id of Object.keys(userMap)) {
        sqlArr.push('when ? then ?');
        params.push(...[parseInt(user_id, 10), userMap[user_id]]);
    }
    sqlArr.push('else 0 end');
    await connection.manager.query(sqlArr.join(' '), params);
}

(async function run() {
    const connection = await createConnection(config.db);
    const arr = await Promise.all([
        queryUserLikedCount(connection, 'like_article_comments'),
        queryUserLikedCount(connection, 'like_boiling_comments'),
        queryUserLikedCount(connection, 'like_bookchapter_comments'),
        queryUserLikedCount(connection, 'like_articles'),
        queryUserLikedCount(connection, 'like_boilingpoints'),
    ]);

    const userLikedMap: { [user_id: number]: number } = {};

    arr.forEach(likedArr => {
        if (likedArr) {
            likedArr.forEach(data => {
                userLikedMap[data.user_id] = userLikedMap[data.user_id] || 0;
                userLikedMap[data.user_id] += data.liked_count;
            });
        }
    });

    await updateUserLikedCount(connection, userLikedMap);

    logger.info({ message: '[cron] user_liked_count done' });

    process.exit(0);
}());
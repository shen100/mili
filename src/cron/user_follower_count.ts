/**
 * 分别统计每一个用户的关注数、粉丝数
 */

import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { MyLoggerService } from '../common/logger.service';

const config = new ConfigService();
const logger = new MyLoggerService();

async function queryFollowerCount(connection): Promise<{user_id: number, follower_count: string}[]> {
    const sql = `
        select user_id, count(*) as follower_count from user_follower
        group by user_id
    `;
    return await connection.manager.query(sql);
}

async function queryFollowCount(connection): Promise<{user_id: number, follow_count: string}[]> {
    const sql = `
        select follower_id as user_id, count(*) as follow_count from user_follower
        group by follower_id
    `;
    return await connection.manager.query(sql);
}

async function updateUserFollowerCount(connection, userMap: { [user_id: number]: { follower_count: number, follow_count: number } }) {
    const followerCountSQLArr: string[] = ['update users set follower_count = case id '];
    const followerCountParams: number[] = [];
    const followCountSQLArr: string[] = [', follow_count = case id '];
    const followCountParams: number[] = [];
    for (const key of Object.keys(userMap)) {
        const user_id = parseInt(key, 10);
        followerCountSQLArr.push('when ? then ?');
        followerCountParams.push(...[ user_id, userMap[user_id].follower_count ]);

        followCountSQLArr.push('when ? then ?');
        followCountParams.push(...[ user_id, userMap[user_id].follow_count ]);
    }
    followerCountSQLArr.push('else 0 end');
    followCountSQLArr.push('else 0 end');
    const sqlArr = followerCountSQLArr.concat(followCountSQLArr);
    const params = followerCountParams.concat(followCountParams);
    await connection.manager.query(sqlArr.join(' '), params);
}

(async function run() {
    const connection = await createConnection(config.db);
    const [ followerCountArr, followCountArr ] = await Promise.all([
        queryFollowerCount(connection),
        queryFollowCount(connection),
    ]);

    const userMap: { [user_id: number]: { follower_count: number, follow_count: number } } = {};
    followerCountArr.forEach(data => {
        userMap[data.user_id] = userMap[data.user_id] || { follower_count: 0, follow_count: 0 };
        userMap[data.user_id].follower_count = parseInt(data.follower_count, 10) || 0;
    });

    followCountArr.forEach(data => {
        userMap[data.user_id] = userMap[data.user_id] || { follower_count: 0, follow_count: 0 };
        userMap[data.user_id].follow_count = parseInt(data.follow_count, 10) || 0;
    });

    await updateUserFollowerCount(connection, userMap);

    logger.info({ message: '[cron] user_follower_count done' });

    process.exit(0);
}());
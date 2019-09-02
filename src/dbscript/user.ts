import { createConnection, In } from 'typeorm';
import { User } from '../entity/user.entity';

export const userRun = async function (connection, config) {
    const userRepository = connection.getRepository(User);

    try {
        await connection.manager.query(`alter table users drop column introduce`);
        await connection.manager.query(`alter table users change signature introduce varchar(500)`);

        await connection.manager.query(`alter table users drop column score`);
        await connection.manager.query(`alter table users change name username varchar(100)`);

        await connection.manager.query(`alter table users add column word_count int`);
        await connection.manager.query(`alter table users add column follower_count int`);
        await connection.manager.query(`alter table users add column like_count int`);
        await connection.manager.query(`alter table users add column job varchar(100)`);
        await connection.manager.query(`alter table users add column company varchar(100)`);

        await connection.manager.query(`alter table users add column github_id int`);
        await connection.manager.query(`alter table users add column github_avatar_url varchar(500)`);
        await connection.manager.query(`alter table users add column github_login varchar(100)`);
        await connection.manager.query(`alter table users add column github_name varchar(100)`);
        await connection.manager.query(`alter table users add column weibo_id int`);
        await connection.manager.query(`alter table users add column weibo_avatar_large varchar(500)`);
        await connection.manager.query(`alter table users add column weibo_screen_name varchar(100)`);
        await connection.manager.query(`alter table users add column weibo_name varchar(100)`);

        const users = await userRepository.find({
            select: {
                id: true,
                avatarURL: true,
            } as any,
        });

        const sqlArr = [`UPDATE users SET avatar_url = CASE id `];
        users.forEach(async (user: User) => {
            if (['/images/avatar/0.png', '/images/avatar/1.png'].indexOf(user.avatarURL) >= 0) {
                const img = `${config.static.imgPath}/avatar.jpg`;
                sqlArr.push(`WHEN ${user.id} THEN "${img}"`);
            } else {
                sqlArr.push(`WHEN ${user.id} THEN "${user.avatarURL}"`);
            }
        });
        sqlArr.push('END');

        const sql = sqlArr.join(' ');
        await connection.manager.query(sql);
        // tslint:disable-next-line:no-console
        console.log('done');
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        process.exit(-1);
    }
};
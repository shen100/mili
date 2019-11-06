import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';

export const updateRootCommentCount = async function (connection) {
    try {
        const ids = await connection.manager.query(`select id from articles`);
        let sql = 'UPDATE articles SET root_comment_count = CASE id ';
        for (let i = 0; i < ids.length; i++) {
            let articleID = ids[i].id;
            const c = await connection.manager.query(`select count(*) as count
                from article_comments where parent_id = 0 and source_id = ?`, [articleID]);
            let count = 0;
            if (c && c[0] && c[0].count) {
                count = parseInt(c[0].count);
            }
            sql = sql + ` WHEN ${articleID} THEN ${count}`;
        }
        sql = sql + ` ELSE 0 END`;

        await connection.manager.query(sql);

        // tslint:disable-next-line:no-console
        console.log('updateRootCommentCount done:');
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        process.exit(-1);
    }
};

if (require.main) {
    // (async function run() {
    //     const config = new ConfigService();
    //     const connection = await createConnection(config.db);
    //     await updateRootCommentCount(connection);
    // }());
}
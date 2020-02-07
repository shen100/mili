import { parseCountResult } from '../utils/query';

export const updateUserArticleViewCount = async (connection) => {
    try {
        const users = await connection.manager.query(`SELECT id FROM users`);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let count = await connection.manager.query(`SELECT SUM(browse_count) as count FROM articles WHERE user_id = ?
                AND deleted_at IS NULL`, [user.id]);

            count = parseCountResult(count);

            await connection.manager.query(`UPDATE users SET article_view_count = ? WHERE id = ?`, [count, user.id]);
        }
    } catch (error) {
        process.exit(-1);
    }
};
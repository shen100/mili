import { parseCountResult } from '../utils/query';

export const updateUserArticleCount = async (connection) => {
    try {
        const users = await connection.manager.query(`SELECT id FROM users`);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let articleCount = await connection.manager.query(`SELECT COUNT(*) as count FROM articles WHERE user_id = ?
                AND deleted_at IS NULL`, [user.id]);

            articleCount = parseCountResult(articleCount);

            await connection.manager.query(`UPDATE users SET article_count = ? WHERE id = ?`, [articleCount, user.id]);
        }
    } catch (error) {
        process.exit(-1);
    }
};
import { parseCountResult } from '../utils/query';

export const updateUserArticleCount = async (connection) => {
    try {
        const users = await connection.manager.query(`SELECT id FROM users`);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let [ likedCount1, likedCount2, likedCount3, likedCount4 ]  = await Promise.all([

                connection.manager.query(`SELECT SUM(liked_count) as liked_count FROM articles WHERE user_id = ?
                    AND deleted_at IS NULL`, [user.id]),
                connection.manager.query(`SELECT SUM(liked_count) as liked_count FROM article_comments WHERE user_id = ?
                    `, [user.id]),
                connection.manager.query(`SELECT SUM(liked_count) as liked_count FROM boilingpoint_comments WHERE user_id = ?
                    `, [user.id]),
                connection.manager.query(`SELECT SUM(liked_count) as liked_count FROM book_chapter_comments WHERE user_id = ?
                    `, [user.id]),
            ]);

            likedCount1 = parseCountResult(likedCount1);
            likedCount2 = parseCountResult(likedCount2);
            likedCount3 = parseCountResult(likedCount3);
            likedCount4 = parseCountResult(likedCount4);

            const likedCount = likedCount1 + likedCount2 + likedCount3 + likedCount4;

            await connection.manager.query(`UPDATE users SET liked_count = ? WHERE id = ?`, [likedCount, user.id]);
        }
    } catch (error) {
        process.exit(-1);
    }
};
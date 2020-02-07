export const rename = async (connection) => {
    await connection.manager.query('rename table user_like_articles to like_articles');
    await connection.manager.query('rename table user_like_boilingpoints to like_boilingpoints');
};
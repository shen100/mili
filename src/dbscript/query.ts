
async function addPublisher(connection, likeTable, sourceTable, sourceIDName) {
    const sql = `alter table ${likeTable} add column publisher int(11)`;
    await connection.manager.query(sql);

    const likeRecords = await connection.manager.query(`select * from ${likeTable}`);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < likeRecords.length; i++) {
        const sourceID = likeRecords[i][sourceIDName];
        const userID = likeRecords[i].user_id;
        const sourceData = await connection.manager.query(`select * from ${sourceTable} where id = ?`, sourceID);
        await connection.manager.query(`update ${likeTable} set publisher = ?
            where ${sourceIDName} = ? and user_id = ? `, [sourceData[0].user_id, sourceID, userID]);
    }
}

export const query = async (connection) => {
    try {
        await addPublisher(connection, 'like_article_comments', 'article_comments', 'comment_id');
        await addPublisher(connection, 'like_boiling_comments', 'boilingpoint_comments', 'comment_id');
        await addPublisher(connection, 'like_bookchapter_comments', 'book_chapter_comments', 'comment_id');
        await addPublisher(connection, 'like_articles', 'articles', 'article_id');
        await addPublisher(connection, 'like_boilingpoints', 'boilingpoints', 'boilingpoint_id');
        // tslint:disable-next-line:no-console
        console.log('done');
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        process.exit(-1);
    }
};
async function getSubComments(connection, id) {
    let comments = await connection.manager.query(`select * from article_comments where parent_id = ?`, [id]);
    comments = comments || [];
    const length = comments.length;
    for (let i = 0; i < length; i++) {
        const arr = await getSubComments(connection, comments[i].id);
        comments = comments.concat(arr);
    }
    return comments;
}

export const commentRoot = async function (connection) {
    try {
        await connection.manager.query('update article_comments set comment_count = 0');
        const rootComments = await connection.manager.query(`select * from article_comments where parent_id = 0`);
        for (let i = 0; i < rootComments.length; i++) {
            let comment = rootComments[i];
            // 得到子评论 及 子子评论
            let subComments = await getSubComments(connection, comment.id) || [];
            if (subComments.length) {
                console.log();
            }
            subComments.sort((a, b) => {
                return a.created_at > b.created_at ? -1 : 1;
            });
            let latestSubComments = [  ] ;
            if (subComments[0]) {
                latestSubComments.push({
                    id: subComments[0].id,
                    pid: subComments[0].parent_id,
                });
            }
            if (subComments[1]) {
                latestSubComments.push({
                    id: subComments[1].id,
                    pid: subComments[1].parent_id,
                });
            }

            if (subComments.length) {
                const subCommentIDs = subComments.map(item => item.id);
                await connection.manager.query(`update article_comments set root_id = ? where id in (?)`, [comment.id, subCommentIDs]);
                await connection.manager.query(`update article_comments set comment_count = ?, latest = ? where id = ?`,
                    [subComments.length, `${JSON.stringify(latestSubComments)}`, comment.id]);
            } else {
                await connection.manager.query(`update article_comments set latest = ? where id = ?`,
                    ['[]', comment.id]);
            }
        }
        // tslint:disable-next-line:no-console
        console.log('commentRoot done:');
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
    //     await commentRoot(connection);
    // }());
}
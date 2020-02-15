import * as marked from 'marked';
import * as bluebird from 'bluebird';
import { MarkedConstants } from '../constants/article';
// import { VoteComment } from '../entity/comment.entity';

marked.setOptions(MarkedConstants.options);

const CommentContentType = {
    Markdown: 1,
    HTML: 2,
};

export const commentRun = async function (connection) {
    // const voteRepository = connection.getRepository(VoteComment);

    try {
        // todo: 增加id作为主键
        await connection.manager.query(`CREATE TABLE like_article_comments (
            comment_id int(11) unsigned NOT NULL,
            user_id int(11) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (comment_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        await connection.manager.query(`rename table comments to article_comments`);
        await connection.manager.query(`alter table article_comments add column root_id int(11) NOT NULL DEFAULT '0'`);

        await connection.manager.query(`CREATE TABLE vote_comments (
            id int(11) unsigned NOT NULL AUTO_INCREMENT,
            html_content text,
            parent_id int(11) NOT NULL DEFAULT '0',
            status int(11) NOT NULL,
            vote_id int(11) unsigned NOT NULL,
            user_id int(11) unsigned NOT NULL,
            comment_count int(11),
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            deleted_at datetime DEFAULT NULL,
            PRIMARY KEY (id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        const comments = await connection.manager.query(`select * from article_comments`);
        const voteComments = [];

        const allCommentMap = {};
        comments.forEach(comment => {
            allCommentMap[comment.id] = comment;
        });

        comments.forEach(comment => {
            comment.parent = allCommentMap[comment.parent_id];
        });

        comments.forEach(comment => {
            let root = comment.parent;
            if (!root) {
                comment.root_id = 0;
                return;
            }
            while (root.parent) {
                root = root.parent;
            }
            comment.root_id = root.id;
        });

        let maxHtmlLength = 0;

        await bluebird.map(comments, async (comment: any, i) => {
            let htmlContent;
            if (comment.content_type === CommentContentType.Markdown) {
                htmlContent = marked(comment.content);
            } else {
                htmlContent = comment.html_content;
            }
            maxHtmlLength = Math.max(maxHtmlLength, htmlContent.length);
            if (comment.source_name === 'vote') {
                voteComments.push({
                    id: comment.id,
                    created_at: comment.created_at,
                    updated_at: comment.updated_at,
                    deleted_at: comment.deleted_at,
                    html_content: htmlContent,
                    status: comment.status,
                    user_id: comment.user_id,
                    parent_id: comment.parent_id,
                    comment_count: 0,
                    source_id: comment.source_id,
                });
            }
            return await bluebird.all([
                connection.manager.query(`update article_comments set html_content = ?,
                    content_type = ${CommentContentType.HTML} where id = ${comment.id}`, [htmlContent]),
                connection.manager.query(`update article_comments set root_id = ${comment.root_id} where id = ${comment.id}`),
            ]);
        });

        // await voteRepository.insert(voteComments);

        await connection.manager.query(`delete from article_comments where source_name = "vote"`);
        await connection.manager.query(`alter table article_comments drop column content;`);
        await connection.manager.query(`alter table article_comments drop column content_type;`);
        await connection.manager.query(`alter table article_comments change html_content html_content varchar(5000)`);

        await connection.manager.query(`alter table article_comments drop column source_name;`);
        await connection.manager.query(`alter table article_comments drop column ups;`);
        await connection.manager.query(`alter table article_comments add column comment_count int(11) NOT NULL DEFAULT '0'`);
        await connection.manager.query(`alter table article_comments add column liked_count int(11) NOT NULL DEFAULT '0'`);
        await connection.manager.query(`alter table article_comments add column latest varchar(100)`);

        console.log('max comment HtmlLength', maxHtmlLength);
        // tslint:disable-next-line:no-console
        console.log('comments.length:', comments.length);
        // tslint:disable-next-line:no-console
        console.log('comments done');
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        process.exit(-1);
    }
};

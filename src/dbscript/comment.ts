import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import * as marked from 'marked';
import * as bluebird from 'bluebird';
import { CommentContentType, TempComment, VoteComment } from '../entity/comment.entity';

const config = new ConfigService();

(async function run() {
    const connection = await createConnection(config.db);
    const commentRepository = connection.getRepository(TempComment);
    const voteRepository = connection.getRepository(VoteComment);

    try {
        await connection.manager.query(`CREATE TABLE userlikecomments (
            comment_id int(11) unsigned NOT NULL,
            user_id int(11) unsigned NOT NULL,
            article_id int(11) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (comment_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        await connection.manager.query(`alter table comments add column root_id int(11) NOT NULL DEFAULT '0'`);

        await connection.manager.query(`CREATE TABLE votecomments (
            id int(11) unsigned NOT NULL AUTO_INCREMENT,
            content text,
            html_content text,
            content_type int(11) NOT NULL,
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

        const comments = await connection.manager.query(`select * from comments`);
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

        await bluebird.map(comments, async (comment: any, i) => {
            let htmlContent;
            if (comment.content_type === CommentContentType.Markdown) {
                htmlContent = marked(comment.content);
            } else {
                htmlContent = comment.html_content;
            }
            if (comment.source_name === 'vote') {
                voteComments.push({
                    id: comment.id,
                    createdAt: comment.created_at,
                    updatedAt: comment.updated_at,
                    deletedAt: comment.deleted_at,
                    content: comment.content,
                    htmlContent,
                    contentType: CommentContentType.HTML,
                    status: comment.status,
                    userID: comment.user_id,
                    parentID: comment.parent_id,
                    commentCount: 0,
                    voteID: comment.source_id,
                });
            }
            return await bluebird.all([
                commentRepository.update({
                    id: comment.id,
                }, {
                    htmlContent,
                    contentType: CommentContentType.HTML,
                }),
                connection.manager.query(`update comments set root_id = ${comment.root_id} where id = ${comment.id}`),
            ]);
        });

        await voteRepository.insert(voteComments);

        await connection.manager.query(`delete from comments where source_name = "vote"`);
        await connection.manager.query(`alter table comments change source_id article_id int`);
        await connection.manager.query(`alter table comments drop column source_name;`);
        await connection.manager.query(`alter table comments drop column ups;`);
        await connection.manager.query(`alter table comments add column comment_count int(11) NOT NULL DEFAULT '0'`);
        await connection.manager.query(`alter table comments add column like_count int(11) NOT NULL DEFAULT '0'`);

        // tslint:disable-next-line:no-console
        console.log('comments.length:', comments.length);
        // tslint:disable-next-line:no-console
        console.log('done');
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        process.exit(-1);
    }
}());
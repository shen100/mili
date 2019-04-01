import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import * as marked from 'marked';
import * as bluebird from 'bluebird';
import { Comment, CommentContentType } from '../entity/comment.entity';

const config = new ConfigService();

(async function run() {
    const connection = await createConnection(config.db);
    const commentRepository = connection.getRepository(Comment);

    try {
        await connection.manager.query(`alter table comments add column comment_count int`);

        const comments = await connection.manager.query(`select id, content,
            source_id, html_content, content_type from comments`);

        await bluebird.map(comments, async (comment: any, i) => {
            let htmlContent;
            if (comment.content_type === CommentContentType.Markdown) {
                htmlContent = marked(comment.content);
            } else {
                htmlContent = comment.html_content;
            }
            return await commentRepository.update({
                id: comment.id,
            }, {
                htmlContent,
                contentType: CommentContentType.HTML,
            });

        });

        await connection.manager.query(`alter table comments change source_id article_id int`);
        await connection.manager.query(`alter table comments drop column source_name;`);

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
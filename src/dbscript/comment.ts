import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import * as marked from 'marked';
import { Comment, CommentContentType } from '../entity/comment.entity';

const config = new ConfigService();

(async function run() {
    const connection = await createConnection(config.db);
    const commentRepository = connection.getRepository(Comment);

    try {
        // await connection.manager.query(`alter table comments add column comment_count int`);

        const comments = await commentRepository.find({
            select: {
                id: true,
                content: true,
                htmlContent: true,
                contentType: true,
            },
        });

        let doneCount = 0;

        comments.forEach(async (comment, i) => {
            const updateData: any = {
                contentType: CommentContentType.HTML,
            };
            if (comment.contentType === CommentContentType.Markdown) {
                updateData.htmlContent = marked(comment.content);
            } else {
                updateData.htmlContent = comment.htmlContent;
            }

            await commentRepository.update({
                id: comment.id,
            }, updateData);

            doneCount++;
            if (doneCount >= comments.length) {
                // tslint:disable-next-line:no-console
                console.log('done');
            }
        });

        // tslint:disable-next-line:no-console
        console.log('comments.length:', comments.length);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        process.exit(-1);
    }
}());
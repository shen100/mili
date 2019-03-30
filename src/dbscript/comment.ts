import { createConnection } from 'typeorm';
import { Comment } from '../entity/Comment.entity';
import { ConfigService } from '../config/config.service';
import * as marked from 'marked';

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

        comments.forEach(async (comment) => {
            const updateData: any = {};
            if (comment.contentType === 1) {
                updateData.htmlContent = marked(comment.content);
            } else {
                updateData.htmlContent = comment.htmlContent;
            }

            await commentRepository.update({
                id: comment.id,
            }, updateData);

            // tslint:disable-next-line:no-console
            console.log('comments.length:', comments.length);
        });
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        process.exit(-1);
    }
}());
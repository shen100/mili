import * as marked from 'marked';
import * as striptags from 'striptags';
import { MarkedConstants } from '../constants/article';

marked.setOptions(MarkedConstants.options);

let errCount = 0;

const summaryLenth = 500;
const summaryStripLenth = 100;

export const chapterMDToHTML = async function (connection) {

    try {
        await connection.manager.query(`alter table books drop column status`);
        await connection.manager.query(`alter table books add column status int`);

        await connection.manager.query(`update books set status = 1`);

        await connection.manager.query(`alter table books add column summary varchar(500)`);
        await connection.manager.query(`alter table books add column word_count int default 0`);
        await connection.manager.query(`alter table books add column study_user_count int default 0`);
        await connection.manager.query(`alter table books add column star_user_count int default 0`);

        await connection.manager.query(`alter table book_chapters add column word_count int default 0`);
        await connection.manager.query(`alter table book_chapters add column root_comment_count int default 0`);

        const book_chapters = await connection.manager.query('select * from book_chapters');

        book_chapters.forEach(async (chapter) => {
            let html;
            const updateData: any = {};
            if (chapter.content_type === 1) {
                html = marked(chapter.content);
                updateData.html_content = html;
            } else {
                html = chapter.html_content;
                updateData.html_content = chapter.html_content;
            }
            let summary = striptags(html);
            summary = summary.replace(/^\s+|\s+$/g, '');
            summary = summary.replace(/\s+|\n$/g, ' ');
            updateData.word_count = summary.length;
            summary = summary.substr(0, summaryStripLenth);
            // updateData.summary = summary;

            await connection.manager.query(`update book_chapters set html_content = ?, word_count = ?
                    where id = ${chapter.id}`, [
                        updateData.html_content, updateData.word_count]);
        });


        // await connection.manager.query(`alter table book_chapters drop column content_type`);
        // await connection.manager.query(`alter table book_chapters drop column content`);

        // tslint:disable-next-line:no-console
        console.log('book_chapters.length:', book_chapters.length);
        // tslint:disable-next-line:no-console
        console.log('book_chapters done');
    } catch (error) {
        errCount++;
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        // tslint:disable-next-line:no-console
        console.log('errCount: ', errCount);
        process.exit(-1);
    }
};
import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { commentRun } from './comment';
import { commentRoot } from './commentRoot';
import { mdToHTML } from './mdToHTML';
import { tablesRun } from './tables';
import { updateRootCommentCount } from './updateRootCommentCount';
import { userRun } from './user';
import { chapterMDToHTML } from './s_book_chapters';

const config = new ConfigService();

(async function() {
    const connection = await createConnection(config.db);
    await commentRun(connection);
    await commentRoot(connection);
    await mdToHTML(connection);
    await chapterMDToHTML(connection);
    await tablesRun(connection);
    await userRun(connection, config);
    await updateRootCommentCount(connection);
    console.log('all done ------------------------');
    // process.exit(0);
}());
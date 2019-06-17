import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { commentRun } from './comment';
import { mdToHTML } from './mdToHTML';
import { tablesRun } from './tables';
import { userRun } from './user';

const config = new ConfigService();

(async function() {
    const connection = await createConnection(config.db);
    await commentRun(connection);
    await mdToHTML(connection);
    await tablesRun(connection);
    await userRun(connection, config);
}());
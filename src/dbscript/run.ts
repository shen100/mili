import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { query } from './query';
import { rename } from './rename_table';

const config = new ConfigService();

// tslint:disable-next-line: only-arrow-functions
(async function() {
    const connection = await createConnection(config.db);
    await rename(connection);
    await query(connection);
    // tslint:disable-next-line: no-console
    console.log('all done ------------------------');
    process.exit(0);
}());
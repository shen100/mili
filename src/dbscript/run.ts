import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { addColumn } from './addColumn';

const config = new ConfigService();

(async function run() {
    const connection = await createConnection(config.db);
    await addColumn(connection);

    // tslint:disable-next-line: no-console
    console.log('----------------- all done -----------------');
    process.exit(0);
}());
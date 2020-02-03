import * as dotenv from 'dotenv';
import * as PostgressConnectionStringParser from 'pg-connection-string';

dotenv.config();

const connectionOptions = PostgressConnectionStringParser.parse(process.env.DATABASE_URL || '');

console.log(connectionOptions);

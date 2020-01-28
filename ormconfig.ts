import * as PostgressConnectionStringParser from 'pg-connection-string';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionOptions = PostgressConnectionStringParser.parse(process.env.DATABASE_URL || '');
module.exports = [
    {
        name: 'default',
        type: 'postgres',
        host: connectionOptions.host,
        port: connectionOptions.port || 5432,
        username: connectionOptions.user,
        password: connectionOptions.password,
        database: connectionOptions.database,
        synchronize: true,
        logging: false,
        entities: ['src/database/entity/**/*.ts'],
        migrations: ['src/database/migration/**/*.ts'],
        subscribers: ['src/database/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/database/entity',
            migrationsDir: 'src/database/migration',
            subscribersDir: 'src/database/subscriber',
        },
    },
    {
        name: 'development',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'story-squad',
        synchronize: false,
        logging: false,
        entities: ['src/database/entity/**/*.ts'],
        migrations: ['src/database/migration/**/*.ts'],
        subscribers: ['src/database/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/database/entity',
            migrationsDir: 'src/database/migration',
            subscribersDir: 'src/database/subscriber',
        },
    },
    {
        name: 'testing',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'story-squad-testing',
        synchronize: true,
        logging: false,
        entities: ['src/database/entity/**/*.ts'],
        migrations: ['src/database/migration/**/*.ts'],
        subscribers: ['src/database/subscriber/**/*.ts'],
    },
];

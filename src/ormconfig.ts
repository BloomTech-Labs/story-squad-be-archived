import * as dotenv from 'dotenv';
import * as path from 'path';
import * as PostgressConnectionStringParser from 'pg-connection-string';

dotenv.config();

const connectionOptions = PostgressConnectionStringParser.parse(process.env.DATABASE_URL || '');
module.exports = [
    {
        name: 'default',
        type: 'postgres',
        host: connectionOptions.host,
        port: Number(connectionOptions.port) || 5432,
        username: connectionOptions.user,
        password: connectionOptions.password,
        database: connectionOptions.database,
        synchronize: true,
        logging: false,
        entities: [path.resolve(__dirname, 'database/entity/**/*.{ts,js}')],
        migrations: [path.resolve(__dirname, 'database/migration/**/*.{ts,js}')],
        subscribers: [path.resolve(__dirname, 'database/subscriber/**/*.{ts,js}')],
        cli: {
            entitiesDir: path.relative('', path.resolve(__dirname, 'database/entity')),
            migrationsDir: path.relative('', path.resolve(__dirname, 'database/migration')),
            subscribersDir: path.relative('', path.resolve(__dirname, 'database/subscriber')),
        },
    },
    {
        name: 'development',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: connectionOptions.user,
        password: connectionOptions.password,
        database: connectionOptions.database,
        synchronize: true,
        logging: false,
        entities: [path.resolve(__dirname, 'database/entity/**/*.{ts,js}')],
        migrations: [path.resolve(__dirname, 'database/migration/**/*.{ts,js}')],
        subscribers: [path.resolve(__dirname, 'database/subscriber/**/*.{ts,js}')],
        cli: {
            entitiesDir: path.relative('', path.resolve(__dirname, 'database/entity')),
            migrationsDir: path.relative('', path.resolve(__dirname, 'database/migration')),
            subscribersDir: path.relative('', path.resolve(__dirname, 'database/subscriber')),
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
        entities: [path.resolve(__dirname, 'database/entity/**/*.ts')],
        migrations: [path.resolve(__dirname, 'database/migration/**/*.ts')],
        subscribers: [path.resolve(__dirname, 'database/subscriber/**/*.ts')],
    },
];

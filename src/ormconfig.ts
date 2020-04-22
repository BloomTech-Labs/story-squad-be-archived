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
        migrations: [path.resolve(__dirname, 'database/migration/default/**/*.{ts,js}')],
        subscribers: [path.resolve(__dirname, 'database/subscriber/**/*.{ts,js}')],
        cli: {
            entitiesDir: path.relative('', path.resolve(__dirname, 'database/entity')),
            migrationsDir: path.relative('', path.resolve(__dirname, 'database/migration/default')),
            subscribersDir: path.relative('', path.resolve(__dirname, 'database/subscriber')),
        },
    },
    {
        name: 'development',
        type: 'postgres',
        host: connectionOptions.host,
        port: Number(connectionOptions.port) || 5432,
        username: connectionOptions.user,
        password: connectionOptions.password,
        database: connectionOptions.database,
        synchronize: true,
        logging: false,
        entities: [path.resolve(__dirname, 'database/entity/**/*.{ts,js}')],
        migrations: [path.resolve(__dirname, 'database/migration/development/**/*.{ts,js}')],
        subscribers: [path.resolve(__dirname, 'database/subscriber/**/*.{ts,js}')],
        cli: {
            entitiesDir: path.relative('', path.resolve(__dirname, 'database/entity')),
            migrationsDir: path.relative(
                '',
                path.resolve(__dirname, 'database/migration/development')
            ),
            subscribersDir: path.relative('', path.resolve(__dirname, 'database/subscriber')),
        },
    },
    {
        /*
            "The idea with the testing configuration for TypeORM was so
            that the testing could seed a database and integration test
            with the database."
                                                               -William
        */
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

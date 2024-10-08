"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const databaseConfig = {
    connection: Env_1.default.get('DB_CONNECTION'),
    connections: {
        mysql: {
            client: 'mysql2',
            connection: {
                host: Env_1.default.get('MYSQL_HOST'),
                port: Env_1.default.get('MYSQL_PORT'),
                user: Env_1.default.get('MYSQL_USER'),
                password: Env_1.default.get('MYSQL_PASSWORD', ''),
                database: Env_1.default.get('MYSQL_DB_NAME'),
                ssl: { "rejectUnauthorized": true }
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
        localsql: {
            client: 'mysql2',
            connection: {
                host: Env_1.default.get('MYSQL_HOST'),
                port: Env_1.default.get('MYSQL_PORT'),
                user: Env_1.default.get('MYSQL_USER'),
                password: Env_1.default.get('MYSQL_PASSWORD', ''),
                database: Env_1.default.get('MYSQL_DB_NAME'),
                charset: 'utf8mb4'
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
        sqlite: {
            client: 'better-sqlite3',
            connection: {
                filename: './app/Services/db.sqlite3'
            },
            useNullAsDefault: true
        },
        prod_sqlite: {
            client: 'better-sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        },
        dev_mysql: {
            client: 'mysql2',
            connection: {
                host: Env_1.default.get('DEV_MYSQL_HOST'),
                port: Env_1.default.get('DEV_MYSQL_PORT'),
                user: Env_1.default.get('DEV_MYSQL_USER'),
                password: Env_1.default.get('DEV_MYSQL_PASSWORD', ''),
                database: Env_1.default.get('DEV_MYSQL_DB_NAME'),
                ssl: { "rejectUnauthorized": true }
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
    }
};
exports.default = databaseConfig;
//# sourceMappingURL=database.js.map
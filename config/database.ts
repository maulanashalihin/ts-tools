/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MySQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MySQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql2
    |
    */
    mysql: {
      client: 'mysql2',
      connection: {
        host: Env.get('MYSQL_HOST'),
        port: Env.get('MYSQL_PORT'),
        user: Env.get('MYSQL_USER'),
        password: Env.get('MYSQL_PASSWORD', ''),
        database: Env.get('MYSQL_DB_NAME'),
        ssl : {"rejectUnauthorized":true}
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
        host: Env.get('MYSQL_HOST'),
        port: Env.get('MYSQL_PORT'),
        user: Env.get('MYSQL_USER'),
        password: Env.get('MYSQL_PASSWORD', ''),
        database: Env.get('MYSQL_DB_NAME'), 
        charset : 'utf8mb4'

      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
    sqlite: {
      client: 'better-sqlite3', // or 'better-sqlite3'
      connection: {
        filename: './app/Services/db.sqlite3'
      },
      
    useNullAsDefault: true
    },
    prod_sqlite: {
      client: 'better-sqlite3', // or 'better-sqlite3'
      connection: {
        filename: './db.sqlite3'
      },
      
    useNullAsDefault: true
    },
    dev_mysql: {
      client: 'mysql2',
      connection: {
        host: Env.get('DEV_MYSQL_HOST'),
        port: Env.get('DEV_MYSQL_PORT'),
        user: Env.get('DEV_MYSQL_USER'),
        password: Env.get('DEV_MYSQL_PASSWORD', ''),
        database: Env.get('DEV_MYSQL_DB_NAME'),
        ssl : {"rejectUnauthorized":true}
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },

  }
}

export default databaseConfig

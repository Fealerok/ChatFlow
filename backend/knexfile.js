// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

  development: {
    client: "pg",
    connection: {
        host: "localhost",
        port: 5423,
        user: "postgres",
        password: "1111",
        database: "ChatFlow"
    },
    migrations: {
      directory: "./migrations"
    }
  },

  staging: {
    client: "pg",
    connection: {
        host: "localhost",
        port: 5423,
        user: "postgres",
        password: "1111",
        database: "ChatFlow"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: "pg",
    connection: {
        host: "localhost",
        port: 5423,
        user: "postgres",
        password: "1111",
        database: "ChatFlow"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

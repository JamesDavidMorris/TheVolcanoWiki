require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'volcanoes',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password'
    },
    migrations: {
      directory: './migrations'
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    migrations: {
      directory: './migrations'
    }
  }
};

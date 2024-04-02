// backend/config/database.js
const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: 'postgres://all_app_academy_projects_7my6_user:k7dOIrZNoAnn9Iboef8Xetu5DmqxOpFd@dpg-co64eqol5elc73abda80-a.oregon-postgres.render.com/all_app_academy_projects_7my6',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Load all models in the folder
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file.indexOf('.') !== 0 && file !== basename)
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

    if (!model.name) {
      throw new Error(`Model in file ${file} is undefined or missing 'name'.`);
    }

    db[model.name] = model;
    if (env === 'development') {
      console.log(`Loaded model: ${model.name}`);
    }
  });

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log(`Associating model: ${modelName}`);
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

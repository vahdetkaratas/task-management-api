'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User has many assignments (via TaskAssignment)
      User.hasMany(models.TaskAssignment, {
        foreignKey: 'userId',
        as: 'assignments', // Explicit alias for assignments
      });

      // User has many histories
      User.hasMany(models.TaskHistory, { foreignKey: 'userId', as: 'histories' });

      // User belongs to many tasks (many-to-many relationship via TaskAssignment)
      User.belongsToMany(models.Task, {
        through: models.TaskAssignment,
        foreignKey: 'userId',
        otherKey: 'taskId',
        as: 'tasks', // Explicit alias for tasks
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};

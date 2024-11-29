'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Task belongs to a user
      Task.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

      // Task has many histories
      Task.hasMany(models.TaskHistory, { foreignKey: 'taskId', as: 'histories' });

      // Task has many assignments
      Task.hasMany(models.TaskAssignment, {
        foreignKey: 'taskId',
        as: 'assignments', // Explicit alias for consistency
      });
    }
  }

  Task.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );

  return Task;
};

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskAssignment extends Model {
    static associate(models) {
      // Many-to-Many: Users assigned to Tasks
      TaskAssignment.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
      TaskAssignment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  TaskAssignment.init(
    {
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TaskAssignment',
    }
  );

  return TaskAssignment;
};

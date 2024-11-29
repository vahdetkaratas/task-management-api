'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskHistory extends Model {
    static associate(models) {
      // TaskHistory is linked to a Task
      TaskHistory.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });

      // TaskHistory is linked to a User who made the change
      TaskHistory.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  TaskHistory.init(
    {
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional: Null if system-generated change
      },
      changeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      oldValue: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      newValue: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      changeDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'TaskHistory',
    }
  );

  return TaskHistory;
};

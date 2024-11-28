'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskHistory.init({
    taskId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    changeType: DataTypes.STRING,
    oldValue: DataTypes.STRING,
    newValue: DataTypes.STRING,
    changeDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TaskHistory',
  });
  return TaskHistory;
};
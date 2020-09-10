'use strict';
module.exports = (sequelize, DataTypes) => {
  const reminder = sequelize.define('reminder', {
    user_id: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    expires_on: DataTypes.STRING,
    description: DataTypes.STRING,
    notify_to: DataTypes.JSON
  }, {});
  reminder.associate = function(models) {
    // associations can be defined here
  };
  return reminder;
};
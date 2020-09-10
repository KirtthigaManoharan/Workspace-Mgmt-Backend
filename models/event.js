'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    user_id: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    notify_to: DataTypes.JSON
  }, {});
  event.associate = function(models) {
    // associations can be defined here
  };
  return event;
};
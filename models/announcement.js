'use strict';
module.exports = (sequelize, DataTypes) => {
  const announcement = sequelize.define('announcement', {
    user_id: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    description: DataTypes.STRING,
    notify_to: DataTypes.JSON
  }, {});
  announcement.associate = function(models) {
    // associations can be defined here
  };
  return announcement;
};
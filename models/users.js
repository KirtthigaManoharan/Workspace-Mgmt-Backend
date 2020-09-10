'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    email: DataTypes.STRING,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    password: DataTypes.STRING,
    company_name: DataTypes.STRING,
    location: DataTypes.STRING,
    emp_count: DataTypes.INTEGER,
    domain_name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    otp: DataTypes.INTEGER
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};
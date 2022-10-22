const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const User = require("./user");

const Board = sequelize.define('Board', {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "_id"
    }
  },
  members: {
    type: DataTypes.ARRAY({ type: DataTypes.INTEGER }),
    defaultValue: []
  },
  image: {
    type: DataTypes.STRING
  }
});

module.exports = Board;
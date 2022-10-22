const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const User = require("./user");
const Board = require("./board");

const List = sequelize.define('List', {
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
  board: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Board,
      key: "_id"
    },
    onDelete: "cascade"
  }
});


module.exports = List;
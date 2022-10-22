const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const User = require("./user");
const Board = require("./board");
const List = require("./List");

const Card = sequelize.define('Card', {
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
  description: {
    type: DataTypes.STRING
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  author: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "_id"
    },
    onDelete: "cascade"
  },
  board: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Board,
      key: "_id"
    },
    onDelete: "cascade"
  },
  list: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: List,
      key: "_id"
    },
    onDelete: "cascade"
  },
});

module.exports = Card;
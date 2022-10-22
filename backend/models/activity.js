const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Board = require("./board");
const Card = require("./card");
const User = require('./user');

const Activity = sequelize.define('Activity', {
  action: {
    type: DataTypes.STRING,
    required: true
  },
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  author: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "_id"
    }
  },
  board: {
    type: DataTypes.INTEGER,
    references: {
      model: Board,
      key: "_id"
    },
    onDelete: "cascade"
  },
  card: {
    type: DataTypes.INTEGER,
    references: {
      model: Card,
      key: "_id",
    },
    onDelete: "cascade"
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
});

Activity.belongsTo(User, { foreignKey: "author", as: "user" });

module.exports = Activity;
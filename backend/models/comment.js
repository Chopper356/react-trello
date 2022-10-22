const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const User = require("./user");
const Card = require("./card");

const Comment = sequelize.define('Comment', {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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
  card: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Card,
      key: "_id"
    },
    onDelete: "cascade"
  }
});

Comment.belongsTo(User, { foreignKey: "author", as: "user" });

module.exports = Comment;
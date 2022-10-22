const Card = require('../models/card');
const Board = require('../models/list');
const User = require('../models/user');
const Activity = require('../models/activity');
const htmlspecialchars = require('htmlspecialchars');

module.exports = {
  async create(req, res) {
    try {
      const data = req.body;

      data.action = htmlspecialchars(data.action);
      const activity = await Activity.create(data);
      const user = await User.findOne({ where: { _id: req.user } });

      delete user.dataValues.password;
      activity.author = user.dataValues;

      res.send(activity);
    }
    catch (error) {
      console.log(error)
      res.status(500).send({ error: "Server error!" });
    }
  },
  async boardActivity(req, res) {
    try {
      const activity = await Activity.findAll({
        where: { board: req.params.id },
        include: {
          attributes: { exclude: ["password"] },
          model: User,
          as: "user"
        },
        raw: true,
        nest: true
      });

      activity.forEach((item) => {
        item.author = item.user;
        delete item.user;
      });

      res.send(activity);
    }
    catch (error) {
      console.log(error)
      res.status(500).send({ error: "Server error!" });
    }
  },
  async cardActivity(req, res) {
    try {
      const activity = await Activity.findAll({
        where: { card: req.params.cardId },
        include: {
          attributes: { exclude: ["password"] },
          model: User,
          as: "user"
        },
        raw: true,
        nest: true
      });

      activity.forEach((item) => {
        item.author = item.user;
        delete item.user;
      });

      console.log(activity, req.params.cardId)

      res.send(activity);
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },
}
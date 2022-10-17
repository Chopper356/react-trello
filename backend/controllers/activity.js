const Card = require('../models/card');
const Board = require('../models/list');
const Activity = require('../models/activity');
const htmlspecialchars = require('htmlspecialchars');

module.exports = {
  async create(req, res) {
    try {
      const data = req.body;

      data.action = htmlspecialchars(data.action);
      const activity = await (await Activity.create(data)).populate("author", "name");

      res.send(activity);
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },
  async boardActivity(req, res) {
    try {
      const activity = await Activity.find({ board: req.params.id }).populate("author", "name");

      res.send(activity);
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },
  async cardActivity(req, res) {
    try {
      const activity = await Activity.find({ card: req.params.cardId }).populate("author", "name");

      res.send(activity);
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },
}
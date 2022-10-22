const { Op } = require("sequelize");
const sequelize = require("../database");
const Card = require('../models/card');
const List = require('../models/list');
const Comment = require('../models/comment');
const Activity = require('../models/activity');
const htmlspecialchars = require('htmlspecialchars');

module.exports = {
  async create(req, res) {
    try {
      const data = req.body;

      const findList = await List.findOne({ _id: data.list });

      if (!findList) {
        return res.status(500).send({ error: "List is not defined!" });
      }

      const cardsLength = await Card.count({ where: { list: data.list } });

      data.title = htmlspecialchars(data.title);
      data.index = cardsLength > 0 ? cardsLength : 0;
      const card = await Card.create(data);

      res.send(card);
    }
    catch (error) {
      console.log(error)
      res.status(500).send({ error: "Server error!" });
    }
  },

  async delete(req, res) {
    try {
      const card = await Card.findOne({ where: { _id: req.params.id } });

      await Card.update({ index: sequelize.literal('index-1') }, { where: { list: card.list, index: { [Op.gte]: card.index } } });

      await Card.destroy({ where: { _id: req.params.id } });

      res.send({ id: req.params.id });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async edit(req, res) {
    try {
      let { title, description } = req.body;
      title = htmlspecialchars(title);
      description = htmlspecialchars(description);

      const new_data = await Card.update({ title, description }, { where: { _id: req.params.id }, returning: true });

      res.send(new_data[1][0].dataValues);
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async move(req, res) {
    try {
      const body = req.body;

      await Promise.all([
        Card.update({ index: sequelize.literal('index-1') }, { where: { list: req.params.from, index: { [Op.gte]: body.indexFrom } } }),
        Card.update({ index: sequelize.literal('index+1') }, { where: { list: req.params.to, index: { [Op.gte]: body.indexTo } } }),
        Card.update({ list: req.params.to, index: body.indexTo }, { where: { _id: body.cardId } })
      ]);

      res.send({ message: "Moved success" });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },
}
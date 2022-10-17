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

      const cardsLength = await Card.countDocuments({ list: data.list });

      data.title = htmlspecialchars(data.title);
      data.index = cardsLength > 0 ? cardsLength + 1 : 0;
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
      await Promise.all([
        Card.findOneAndRemove({ _id: req.params.id }),
        Activity.deleteMany({ card: req.params.id }),
        Comment.deleteMany({ card: req.params.id })
      ])

      res.send({ message: "Card deleted!" });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async edit(req, res) {
    try {
      let { content, description } = req.body;
      content = htmlspecialchars(content);
      description = htmlspecialchars(description);

      const new_data = await Card.updateOne({ _id: req.params.id }, { content, description });

      res.send({ new_data });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async move(req, res) {
    try {
      const body = req.body;

      await Promise.all([
        Card.updateMany({ list: req.params.from, index: { $gte: body.indexFrom } }, { $inc: { index: -1 } }),
        Card.updateMany({ list: req.params.to, index: { $gte: body.indexTo } }, { $inc: { index: 1 } }),
        Card.updateOne({ _id: body.cardId }, { list: req.params.to, index: body.indexTo })
      ]);

      res.send({ message: "Moved success" });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },
}
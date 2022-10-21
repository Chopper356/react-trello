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
      const card = await Card.findOne({ _id: req.params.id });

      await Card.updateMany({ list: card.list.toString(), index: { $gte: card.index } }, { $inc: { index: -1 } });

      await Promise.all([
        Card.findOneAndRemove({ _id: req.params.id }),
        Comment.deleteMany({ card: req.params.id })
      ])

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

      const new_data = await Card.findOneAndUpdate({ _id: req.params.id }, { title, description }, { new: true });

      res.send(new_data);
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
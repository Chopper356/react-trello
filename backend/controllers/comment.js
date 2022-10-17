// const List = require('../models/list');
const Comment = require('../models/comment');
const Card = require('../models/card');
const User = require('../models/user');
const htmlspecialchars = require('htmlspecialchars');

module.exports = {
  async create(req, res) {
    try {
      const data = req.body;

      const card = await Card.findOne({ _id: data.card });

      if (!card) {
        return res.status(500).send({ error: "Card is not defined!" });
      }

      data.content = htmlspecialchars(data.content);
      const comment = await Comment.create(data);
      const user = await User.findOne({ _id: comment.author });
      comment.author = user;

      res.send(comment);
    }
    catch (error) {
      console.log(error)
      res.status(500).send({ error: "Server error!" });
    }
  },

  async delete(req, res) {
    try {
      await Comment.deleteOne({ _id: req.params.id });

      res.send({ message: "Comment deleted" });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async getAll(req, res) {
    try {
      const comments = await Comment.find({ card: req.params.id }).populate("author", "name");

      res.send(comments);
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },
}
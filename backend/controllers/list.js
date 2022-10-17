const Board = require("../models/board");
const List = require("../models/list");
const Card = require("../models/card");
const htmlspecialchars = require("htmlspecialchars");

module.exports = {
  async create(req, res) {
    try {
      const data = req.body;

      const findBoard = await Board.findOne({ _id: data.board });

      if (!findBoard) {
        return res.status(500).send({ error: "Board is not defined!" });
      }

      data.title = htmlspecialchars(data.title);
      const new_list = await List.create(data);

      res.send({ new_list });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async delete(req, res) {
    try {
      await Promise.all([
        List.findOneAndRemove({ _id: req.params.id }),
        Card.deleteMany({ list: req.params.id })
      ])

      res.send({ message: "List deleted" });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async edit(req, res) {
    try {
      const data = htmlspecialchars(req.body.title);

      const new_data = await List.updateOne({ _id: req.params.id }, { title: data });

      res.send({ new_data });
    }
    catch (error) {
      console.log(error)
      res.status(500).send({ error: "Server error!" });
    }
  },
}
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
      new_list.dataValues.cards = [];
      console.log(new_list)

      res.send(new_list);
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async delete(req, res) {
    try {
      List.destroy({ where: { _id: req.params.id }, cascade: true });

      res.send({ message: "List deleted", deleted_id: req.params.id });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async edit(req, res) {
    try {
      const data = htmlspecialchars(req.body.title);

      const new_data = await List.update({ title: data }, { where: { _id: req.params.id }, returning: true });

      res.send(new_data[1][0].dataValues);
    }
    catch (error) {
      console.log(error)
      res.status(500).send({ error: "Server error!" });
    }
  },
}
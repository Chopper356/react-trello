const Board = require('../models/board');
const Task = require("../models/task");
const htmlspecialchars = require('htmlspecialchars');

module.exports = {
  async create(req, res) {
    try {
      let data = req.body;

      let findBoard = await Board.findOne({ _id: data.board });

      if (!findBoard) {
        return res.send({ status: 500, error: "Board is not defined!" });
      }

      data.title = htmlspecialchars(data.title);
      data.content = htmlspecialchars(data.content);
      let new_task = await Task.create(data);

      res.send({ status: 200, new_task });
    }
    catch (error) {
      res.send({ status: 500, error: "Server error!" });
    }
  },

  async delete(req, res) {
    try {
      await Task.findOneAndRemove({ _id: req.params.id });

      res.send({ status: 200 });
    }
    catch (error) {
      res.send({ status: 500, error: "Server error!" });
    }
  },

  async edit(req, res) {
    try {
      let data = req.body;
      data.title = htmlspecialchars(data.title);
      data.content = htmlspecialchars(data.content);

      let new_data = await Task.updateOne({ _id: req.params.id }, { title: data.title, content: data.content });

      res.send({ status: 200, new_data });
    }
    catch (error) {
      res.send({ status: 500, error: "Server error!" });
    }
  },
}
const Board = require('../models/board');
const User = require("../models/user");

module.exports = {
  async create(req, res) {
    try {
      let data = req.body;

      let findUser = await User.findOne({ _id: data.author });

      if (!findUser) {
        return res.send({ status: 500, error: "User is not defined!" });
      }

      let new_board = await Board.create(data);

      res.send({ status: 200, new_board });
    }
    catch (error) {
      res.send({ status: 500, error: "Server error!" });
    }
  },

  async delete(req, res) {
    try {
      await Board.findOneAndRemove({ _id: req.params.id });

      res.send({ status: 200 });
    }
    catch (error) {
      res.send({ status: 500, error: "Server error!" });
    }
  },

  async edit(req, res) {
    try {
      let data = req.body;

      let new_data = await Board.updateOne({ _id: req.params.id }, { title: data.title });

      res.send({ status: 200, new_data });
    }
    catch (error) {
      res.send({ status: 500, error: "Server error!" });
    }
  },

  async all(req, res) {
    try {
      let boards = await Board.find({});

      res.send(boards);
    }
    catch (error) {
      res.send({ status: 500, error: "Server error!" });
    }
  },
}
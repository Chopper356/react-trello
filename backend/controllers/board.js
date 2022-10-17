const imgbbUploader = require("imgbb-uploader");

const Board = require('../models/board');
const List = require("../models/list");
const Card = require("../models/card");
const config = require("../config/dev.json");

module.exports = {
  async create(req, res) {
    try {
      const image_extnsions = ["png", "jpg", "jpeg", "gif"];
      const data = req.body;
      data.author = req.user;

      if (data.image) {
        const [image_info, image_data] = data.image.split(",");

        const type_regexp = new RegExp("\/(.+);", "g");
        const image_type = type_regexp.exec(image_info)[1];

        if (!image_extnsions.some(type => type === image_type)) {
          return res.status(500).send({ error: "File extension not supported" });
        }

        // if (image_extnsions.indexOf(match[1]) === -1) return res.status(500).send({ error: "File extension not supported" });

        const options = {
          apiKey: config.imgbb_key,
          base64string: image_data
        }

        const imagebb = await imgbbUploader(options);

        data.image = imagebb.image.url;
      }

      const new_board = await Board.create(data);

      res.send(new_board);
    }
    catch (error) {
      res.status(500).send({ error });
    }
  },

  async delete(req, res) {
    try {
      await Promise.all([
        Board.findOneAndRemove({ _id: req.params.id }),
        List.deleteMany({ board: req.params.id }),
        Card.deleteMany({ board: req.params.id })
      ]);

      res.end();
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async edit(req, res) {
    try {
      const data = req.body;

      const new_data = await Board.updateOne({ _id: req.params.id }, { title: data.title });

      res.send({ new_data });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async all(req, res) {
    try {
      const boards = await Board.find({});

      res.send(boards);
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async getBoardData(req, res) {
    try {
      const board = await Board.findOne({ _id: req.params.id });
      if (req.user !== board.author.toString() && !board.members.some(member => member._id.toString() === req.user)) {
        return res.status(403).end();
      }

      const lists = await List.find({ board: req.params.id }).lean();
      for (let list of lists) {
        list.cards = await Card.find({ list: list._id }).sort({ index: 1 });
      }

      res.send({ board, lists });
    }
    catch (error) {
      res.status(500).send({ error: "Server error!" });
    }
  },

  async changeMembers(req, res) {
    try {
      const new_members = req.body;
      const new_data = await Board.updateOne({ _id: req.params.id }, { members: new_members });

      res.send(new_data);
    }
    catch (error) {
      console.log(error)
      res.status(500).send({ error: "Server error!" });
    }
  }
}
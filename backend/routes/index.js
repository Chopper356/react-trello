const express = require('express');
const router = express.Router();

const Auth = require("./auth");
const Board = require("./board");
const List = require("./list");
const Users = require("./users");
const Card = require("./card");
const Comment = require("./comment");
const Activity = require("./activity");

router.use("/api/auth", Auth);
router.use("/api/boards", Board);
router.use("/api/lists", List);
router.use("/api/users", Users);
router.use("/api/cards", Card);
router.use("/api/comments", Comment);
router.use("/api/activity", Activity);

module.exports = router;
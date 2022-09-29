const express = require('express');
const router = express.Router();

const Auth = require("./auth");
const Board = require("./board");
const Task = require("./task");

router.use("/api/auth", Auth);
router.use("/api/boards", Board);
router.use("/api/tasks", Task);

module.exports = router;
const express = require('express');
const router = express.Router();
const board = require('../controllers/board');
const authtoken = require("../middlewares/auth");

router.post('/create', authtoken, board.create);
router.delete('/delete/:id', authtoken, board.delete);
router.post('/edit/:id', authtoken, board.edit);
router.get('/', board.all);
router.get('/:id', authtoken, board.getBoardData);
router.put('/changemembers/:id', authtoken, board.changeMembers);

module.exports = router;
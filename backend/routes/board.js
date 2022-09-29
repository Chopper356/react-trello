const express = require('express');
const router = express.Router();
const board = require('../controllers/board');

router.post('/create', board.create);
router.delete('/:id/delete', board.delete);
router.post('/:id/edit', board.edit);
router.get('/', board.all);

module.exports = router;
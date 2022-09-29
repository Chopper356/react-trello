const express = require('express');
const router = express.Router();
const task = require('../controllers/task');

router.post('/create', task.create);
router.delete('/:id/delete', task.delete);
router.post('/:id/edit', task.edit);

module.exports = router;
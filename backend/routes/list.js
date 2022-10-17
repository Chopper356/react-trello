const express = require('express');
const router = express.Router();
const list = require('../controllers/list');

router.post('/create', list.create);
router.delete('/delete/:id', list.delete);
router.post('/edit/:id', list.edit);

module.exports = router;
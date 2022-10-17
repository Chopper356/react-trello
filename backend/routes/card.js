const express = require('express');
const router = express.Router();
const card = require('../controllers/card');

router.post('/create', card.create);
router.delete('/delete/:id', card.delete);
router.post('/edit/:id', card.edit);
router.post('/move/:from/:to', card.move);

module.exports = router;
const express = require('express');
const router = express.Router();
const card = require('../controllers/card');
const authtoken = require("../middlewares/auth");

router.post('/create', authtoken, card.create);
router.delete('/delete/:id', authtoken, card.delete);
router.post('/edit/:id', authtoken, card.edit);
router.post('/move/:from/:to', authtoken, card.move);

module.exports = router;
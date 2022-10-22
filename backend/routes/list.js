const express = require('express');
const router = express.Router();
const list = require('../controllers/list');
const authtoken = require("../middlewares/auth");

router.post('/create', authtoken, list.create);
router.delete('/delete/:id', authtoken, list.delete);
router.post('/edit/:id', authtoken, list.edit);

module.exports = router;
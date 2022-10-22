const express = require('express');
const router = express.Router();
const comment = require('../controllers/comment');
const authtoken = require("../middlewares/auth");

router.post('/create', authtoken, comment.create);
router.delete('/delete/:id', authtoken, comment.delete);
router.get('/card/:id', authtoken, comment.getAll);

module.exports = router;
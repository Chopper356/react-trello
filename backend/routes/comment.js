const express = require('express');
const router = express.Router();
const comment = require('../controllers/comment');

router.post('/create', comment.create);
router.delete('/delete/:id', comment.delete);
router.get('/card/:id', comment.getAll);

module.exports = router;
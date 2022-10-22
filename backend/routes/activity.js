const express = require('express');
const router = express.Router();
const activity = require('../controllers/activity');
const authtoken = require("../middlewares/auth");

router.post('/create', authtoken, activity.create);
router.get('/board/:id', activity.boardActivity);
router.get('/board/:boardId/card/:cardId', activity.cardActivity);

module.exports = router;
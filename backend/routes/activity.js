const express = require('express');
const router = express.Router();
const activity = require('../controllers/activity');

router.post('/create', activity.create);
router.get('/board/:id', activity.boardActivity);
router.get('/board/:boardId/card/:cardId', activity.cardActivity);

module.exports = router;
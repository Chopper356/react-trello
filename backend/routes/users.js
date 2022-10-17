const express = require('express');
const router = express.Router();
const authtoken = require("../middlewares/auth");
const user = require('../controllers/user');

router.get('/', authtoken, user.getUserData);
router.post('/search', authtoken, user.getSearchedUsers);

module.exports = router;
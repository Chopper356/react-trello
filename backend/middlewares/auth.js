const jwt = require('jsonwebtoken');
const config = require('../config/dev.json');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw "No token!";
    }

    const decodedToken = jwt.verify(token, config.jwt);
    if (decodedToken) {
      req.user = decodedToken.id;
      next();
    }
    else {
      throw "Invalid token!";
    }
  }
  catch (error) {
    res.status(500).send({ error });
  }
}
const express = require('express')
const routes = require('./routes');
const cors = require('cors');
const config = require("./config/dev.json")
const bodyParser = require('body-parser')
const app = express()
require('./database');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(routes);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})
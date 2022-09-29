const mongoose = require('mongoose');
const config = require('./config/dev.json');

mongoose.connect(config.mongo, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("MongoDB connected!")
});
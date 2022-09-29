const config = require("../config/dev.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = {
	async signUp(req, res) {
		try {
			let user = req.body;

			let saltRounds = 8;

			user.password = await bcrypt.hash(user.password, saltRounds);
			let new_user = await User.create(user);
			let token = jwt.sign({ id: new_user._id }, config.jwt);

			res.send({ status: 200, token });
		}
		catch (error) {
			res.status(500).send({ error: error.code == 11000 ? "This user already exists!" : error });
		}
	},

	async signIn(req, res) {
		try {
			let user = req.body;
			let findUser = await User.findOne({ email: user.email });

			if (!findUser) {
				return res.status(500).send({ error: "Incorrect email" });
			}

			let passdecode = await bcrypt.compare(user.password, findUser.password)

			if (!passdecode) {
				return res.status(500).send({ error: "Incorrect password" });
			}

			let token = jwt.sign({ id: findUser._id }, config.jwt);
			res.send({ status: 200, token });
		}
		catch (error) {
			console.log(error)
			res.status(500).send({ error: "Server error!" });
		}
	}
}
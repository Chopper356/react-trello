const config = require("../config/dev.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = {
	async signUp(req, res) {
		try {
			const user = req.body;

			const saltRounds = 8;

			user.password = await bcrypt.hash(user.password, saltRounds);
			const new_user = await User.create(user);
			const token = jwt.sign({ id: new_user._id }, config.jwt);

			res.send({ token });
		}
		catch (error) {
			res.status(500).send({ error: error.code == 11000 ? "This user already exists!" : error });
		}
	},

	async signIn(req, res) {
		try {
			const user = req.body;
			const findUser = await User.findOne({ email: user.email });

			if (!findUser) {
				return res.status(500).send({ error: "Incorrect email" });
			}

			const passdecode = await bcrypt.compare(user.password, findUser.password)

			if (!passdecode) {
				return res.status(500).send({ error: "Incorrect password" });
			}

			const token = jwt.sign({ id: findUser._id }, config.jwt);
			res.send({ token });
		}
		catch (error) {
			console.log(error)
			res.status(500).send({ error: "Server error!" });
		}
	}
}
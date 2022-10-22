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
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });

			console.log(user)

			if (!user) {
				return res.status(500).send({ error: "Incorrect email" });
			}

			const pass_decode = await bcrypt.compare(password, user.password)

			if (!pass_decode) {
				return res.status(500).send({ error: "Incorrect password" });
			}

			const token = jwt.sign({ id: user._id }, config.jwt);
			res.send({ token });
		}
		catch (error) {
			console.log(error)
			res.status(500).send({ error: "Server error!" });
		}
	}
}
const User = require("../models/user");

module.exports = {
	async getUserData(req, res) {
		try {
			const user = await User.findOne({ _id: req.user });

			if (!user) {
				return res.status(500).send({ error: "User is not defined!" });
			}
			res.send({ user });
		}
		catch (error) {
			res.status(500).send({ error: "Server error!" });
		}
	},
	async getSearchedUsers(req, res) {
		try {
			const name = new RegExp(req.body.name, "gi");
			const users = await User.find({ name });

			res.send(users);
		}
		catch (error) {
			res.status(500).send({ error: "Server error!" });
		}
	},
}
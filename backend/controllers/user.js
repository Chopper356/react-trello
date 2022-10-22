const { Op } = require("sequelize");
const User = require("../models/user");

module.exports = {
	async getUserData(req, res) {
		try {
			const user = await User.findOne({ where: { _id: req.user } });

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
			const users = await User.findAll({
				where: {
					name: {
						[Op.iLike]: `%${req.body.name}%`
					}
				}
			});

			res.send(users);
		}
		catch (error) {
			console.log(error)
			res.status(500).send({ error: "Server error!" });
		}
	},
}
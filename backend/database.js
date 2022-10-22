const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('trello', 'postgres', '', {
	host: 'localhost',
	dialect: 'postgres'
});


const connect = async () => {
	try {
		await sequelize.authenticate();
		// await sequelize.sync({ force: true });
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

connect();

module.exports = sequelize;
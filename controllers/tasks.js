const db = require('../database.js');
const logger = require('../logger.js');

exports.getAllTasks = user => {
	return new Promise((resolve, reject) => {
		let query = 'SELECT * from task WHERE owner_id = ?';

		db.all(query, [user.user.id], (err, tasks) => {
			if (err) {
				logger.error(err);
				reject(err);
				return false;
			}
			logger.debug(`All tasks for user ${user.user.id} retrieved.`);
			resolve(tasks);
		});
	});
};

exports.addTask = (user_id, task_name) => {
	let query = 'INSERT INTO task (task_name, owner_id) VALUES (?,?)';
	db.run(query, [task_name, user_id], err => {
		if (err) {
			logger.error(err);
			return false;
		}
		logger.info(`User ${user_id} added task ${task_name}.`);
		return { message: 'Task successfully added.' };
	});
};

exports.removeTask = (user_id, task_id) => {
	let query = 'DELETE FROM task WHERE task_id = ?';
	db.run(query, [task_id], err => {
		if (err) {
			logger.error(err);
			return false;
		}

		logger.info(`User ${user_id} deleted task ${task_id}.`);
		return { message: 'Task deleted.' };
	});
};

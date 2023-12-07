let sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const logger = require('./logger');

const DBSOURCE = 'todo.db';

let db = new sqlite3.Database(DBSOURCE, err => {
	if (err) {
		logger.error(err.message);
		throw err;
	} else {
		logger.info('Connected to the SQLite database.');

		db.run(
			`CREATE TABLE role (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL
            );`,
			err => {
				if (err) {
					logger.error(err.message);
				} else {
					// SQL parameter binding to prevent SQL injection
					let query = 'INSERT INTO role (name) VALUES (?)';
					db.run(query, ['admin']);
					db.run(query, ['user']);

					logger.info('Admin and user roles created.');
				}
			}
		);

		db.run(
			`CREATE TABLE user (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL, 
				email TEXT UNIQUE NOT NULL, 
				password TEXT NOT NULL, 
				role_id INTEGER DEFAULT 2,
				CONSTRAINT email_unique UNIQUE (email),
				FOREIGN KEY (role_id) REFERENCES role (id) 
            );`,
			err => {
				if (err) {
					logger.error(err.message);
				} else {
					// SQL parameter binding to prevent SQL injection
					let query = 'INSERT INTO user (name, email, password, role_id) VALUES (?,?,?,?)';
					db.run(query, ['admin', 'admin@example.com', bcrypt.hash('admin123456', 8), 1]);
					db.run(query, ['user', 'user@example.com', bcrypt.hash('user123456', 8), 2]);
				}
			}
		);

		db.run(
			`CREATE TABLE task (
				task_id INTEGER PRIMARY KEY AUTOINCREMENT,
				task_name TEXT NOT NULL,
				task_completed BOOLEAN DEFAULT 0, 
				owner_id INTEGER NOT NULL,
				FOREIGN KEY (owner_id) REFERENCES user (id) 
			);`,
			err => {
				if (err) {
					logger.error(err.message);
				} else {
					// SQL parameter binding to prevent SQL injection
					let insertTask = 'INSERT INTO task (task_name, owner_id) VALUES (?,?)';
					db.run(insertTask, ['Water plants', 1]);
					db.run(insertTask, ['Boil Eggs', 2]);
				}
			}
		);
	}
});

module.exports = db;

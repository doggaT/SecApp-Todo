const express = require('express');
const router = express.Router();
const app = express();
const { validateToken, decodeToken } = require('../jwt');
const cookieParser = require('cookie-parser');
const { getAllTasks, addTask, removeTask } = require('../controllers/tasks');

app.use(cookieParser());

router.get('/', (req, res) => {
	res.render('../views/index');
});

router.get('/tasks', validateToken, (req, res) => {
	const accessToken = req.cookies['access-token'];
	const user = decodeToken(accessToken);

	getAllTasks(user).then(tasks => {
		res.render('../views/tasks', { user, tasks });
	});
});

router.post('/tasks', validateToken, (req, res) => {
	const accessToken = req.cookies['access-token'];
	const user = decodeToken(accessToken);

	addTask(user.user.id, req.body.task_name);
	res.redirect('/tasks');
});

router.post('/delete-task', validateToken, (req, res) => {
	const accessToken = req.cookies['access-token'];
	const user = decodeToken(accessToken);

	removeTask(user.user.id, req.body.task_id);
	res.redirect('/tasks');
});

module.exports = router;

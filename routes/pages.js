const express = require('express');
const router = express.Router();
const { validateToken, decodeToken } = require('../jwt');
const cookieParser = require('cookie-parser');
const { getAllTasks, addTask, removeTask } = require('../controllers/tasks');
const csrf = require('csurf');
const { validationResult, body } = require('express-validator');
const logger = require('../logger');

const csrfProtection = csrf({ cookie: true });

router.use(csrfProtection);
router.use(cookieParser());

router.get('/', csrfProtection, (req, res) => {
	const csrfToken = req.csrfToken();

	res.render('../views/index', { csrfToken });
});

router.get('/tasks', validateToken, csrfProtection, (req, res) => {
	const accessToken = req.cookies['access-token'];
	const user = decodeToken(accessToken);
	const csrfToken = req.csrfToken();

	getAllTasks(user).then(tasks => {
		res.render('../views/tasks', { user, tasks, csrfToken });
	});
});

router.post(
	'/tasks',
	body('task_name').trim().escape(),
	validateToken,
	csrfProtection,
	(req, res) => {
		const accessToken = req.cookies['access-token'];
		const user = decodeToken(accessToken);

		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			logger.warn(validationErrors.array()[0].msg);
			res.redirect('/tasks');
		} else {
			addTask(user.user.id, req.body.task_name);
			res.redirect('/tasks');
		}
	}
);

router.post('/delete-task', validateToken, csrfProtection, (req, res) => {
	const accessToken = req.cookies['access-token'];
	const user = decodeToken(accessToken);

	removeTask(user.user.id, req.body.task_id);
	res.redirect('/tasks');
});

module.exports = router;

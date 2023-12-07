const pino = require('pino');

const logger = pino(
	{
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
				ignore: 'pid, hostname',
			},
		},
		redact: {
			paths: [
				'user.user.username',
				'user.user.email',
				'user.user.password',
				'*.user.username',
				'*.user.email',
				'*.user.password',
				'*.username',
				'*.email',
				'*.password',
				'username',
				'email',
				'password',
			],
			censor: '<PII>',
		},
	},
	pino.destination(`${__dirname}/app.log`)
);

module.exports = logger;

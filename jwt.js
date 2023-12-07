const { sign, verify, decode } = require('jsonwebtoken');

const createToken = user => {
	const accessToken = sign(
		{ user: { id: user.id, username: user.name, email: user.email } },
		'happybeescollectingcoins'
	);
	return accessToken;
};

const validateToken = (req, res, next) => {
	const accessToken = req.cookies['access-token'];

	if (!accessToken) {
		return res.render('/', {
			message: 'User not authenticated.',
		});
	}

	try {
		const validToken = verify(accessToken, 'happybeescollectingcoins');

		if (validToken) {
			req.authenticated = true;
			return next();
		}
	} catch (err) {
		console.error(err);
	}
};

const decodeToken = token => {
	return decode(token);
};

module.exports = { createToken, validateToken, decodeToken };

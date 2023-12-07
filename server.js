const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./logger');
const session = require('express-session');
require('dotenv').config();

let bodyParser = require('body-parser');
let path = require('path');
const helmet = require('helmet');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(cors());

app.use(
	helmet({
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'"],
				scriptSrc: ["'unsafe-inline'"],
				scriptSrcAttr: ["'unsafe-inline'"],
			},
		},
	})
);

const sessionConfig = session({
	secret: process.env.CSRFT_SESSION_SECRET,
	keys: ['safekey'],
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: parseInt(process.env.CSRFT_EXPIRESIN),
		sameSite: 'strict',
		httpOnly: true,
		domain: process.env.DOMAIN,
		secure: true,
	},
});
app.use(sessionConfig);

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const domain = process.env.DOMAIN;
const port = process.env.PORT;

app.listen(port, () => {
	logger.info(`Server running on port: ${domain}:${port}`);
});

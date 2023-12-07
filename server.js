const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./logger');

let bodyParser = require('body-parser');
let path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(cors());

const HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
	logger.info(`Server running on port: ${HTTP_PORT}`);
});

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

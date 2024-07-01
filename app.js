

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express(); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/mydb', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});


const allowedCors = [
	'localhost:3000',
];

app.use((req, res, next) => {
	const { method } = req;
	const { origin } = req.headers;

	const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

	if (allowedCors.includes(origin)) {
		res.header('Access-Control-Allow-Origin', origin);
	}

	const requestHeaders = req.headers['access-control-request-headers'];
	if (method === 'OPTIONS') {
		res.header('Access-Control-Allow-Headers', requestHeaders);
		res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
		res.status(200).send();
	}

	next();
});

app.use(requestLogger);

app.use('/', require('./routes/shorts'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
	res.status(err.statusCode);
	res.send({ message: err.message });
});


app.listen(PORT, () => {
	console.log('Ссылка на сервер');
	console.log(PORT);
});
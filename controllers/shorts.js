const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Short = require('../models/short');

require('dotenv').config();

const { API_URL } = process.env;

const NotFoundError = require('../errors/not-found-err'); // 404
const BadRequestError = require('../errors/bad-request-err'); // 400
const ServerError = require('../errors/server-err'); // 500
const ConflictError = require('../errors/conflict-err'); // 409


module.exports.createShort = (req, res, next) => {
	const {
		url,
	} = req.body;

	bcrypt.hash(url, 10)
		.then((hash) => {
			var shortUrl = hash.slice(10)
			Short.find({ shortcode: shortUrl })
				.then((short) => {
					if (short[0] === undefined) {
						Short.create({
							url, shortcode: hash.slice(5, 15)
						})
						.then((short) => {
							const data = {
								shortcode: short.shortcode,
								redirect: `http://${API_URL}/${short.shortcode}`
							}
							res.send({ data })
						})
						.catch((err) => {
							if (err.name === 'ValidationError') {
								const e = new BadRequestError('Переданы некорректные данные при создании Short.');
								next(e);
							}
							const e = new ServerError('Ошибка по умолчанию.');
							next(e);
						})
					} else {
						throw new ConflictError('Ссылка уже существует.');
					}
				})
				.catch((err) => {
					if (err.statusCode === 409) {
						next(err);
					}
					if (err.name === 'ValidationError') {
						const e = new BadRequestError('Переданы некорректные данные при создании Short.');
						next(e);
					}
					const e = new ServerError('Ошибка по умолчанию.');
					next(e);
				});
		})
	
};

module.exports.redirectShort = (req, res, next) => {
	Short.find({ shortcode: req.params.shortcode })
		.then((short) => {
			if (short[0] === undefined) {
				throw new NotFoundError('Ссылка не найдена.');
			} else {
				
				res.redirect(short[0].url)
			}
		})
		.catch((err) => {
			if (err.statusCode === 409) {
				next(err);
			}
			if (err.name === 'ValidationError') {
				const e = new BadRequestError('Переданы некорректные данные при создании Short.');
				next(e);
			}
			const e = new ServerError('Ошибка по умолчанию.');
			next(e);
		});
}

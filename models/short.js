const mongoose = require('mongoose');
const validator = require('validator');

const shortSchema = new mongoose.Schema({
	url: {
		type: String,
		default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
		validate: {
			validator(v) {
				return /^(https?:\/\/)([\w-]{1,32}\.[\w-]{1,32})[^\s]*/gm.test(v);
			},
			message: 'Не правильная ссылка',
		},
	},
	shortcode: {
		type: String,
		select: false,
	},
});



module.exports = mongoose.model('short', shortSchema);
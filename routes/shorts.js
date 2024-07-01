const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
	createShort, redirectShort
} = require('../controllers/shorts');

router.post('/shorten', celebrate({
	body: Joi.object().keys({
		url: Joi.string(),
	}),
}), createShort);

router.get('/:shortcode', redirectShort)

module.exports = router;
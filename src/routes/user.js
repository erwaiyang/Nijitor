const router = require('express').Router();
const Joi = require('joi');
const Celebrate = require('celebrate');
const crypto = require('crypto');
const secret = require('../../secrets/password_key');

const signUpSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
router.post('/sign_up', Celebrate(signUpSchema), async (req, res, next) => {
  try {
    const { password } = req.body;
    const hash = await crypto.createHmac('sha512', secret)
      .update(password)
      .digest('hex');
    res.send({ encrypted: hash });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

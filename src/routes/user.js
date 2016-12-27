const router = require('express').Router();
const Joi = require('joi');
const Celebrate = require('celebrate');
const crypto = require('crypto');
const secret = require('../../secrets/password_key');
const query = require('../mysql_connection').query;

async function getEncryptedPassword(password) {
  return crypto.createHmac('sha512', secret)
    .update(password)
    .digest('hex');
}

const signUpSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
router.post('/sign_up', Celebrate(signUpSchema), async (req, res, next) => {
  try {
    const { password } = req.body;
    const hash = await getEncryptedPassword(password);
    res.send({ encrypted: hash });
  } catch (err) {
    return next(err);
  }
});

const signInSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
router.post('/sign_in', Celebrate(signInSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const encryptedPassword = await getEncryptedPassword(password);
    const sql = 'SELECT user_id FROM users WHERE username = ? AND password = ? LIMIT 0,1;';
    const result = (await query(sql, [username, encryptedPassword]))[0];
    if (!result) {
      return next({ status: 401, message: 'user not found' });
    }
    res.send({ result });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

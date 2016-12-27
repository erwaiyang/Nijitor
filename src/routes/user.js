const crypto = require('crypto');

const secret = require('../../secrets/password_key');
const hash = crypto.createHmac('sha512', secret)
  .update('it is my passworddd')
  .digest('hex');
console.log(hash);
console.log(hash.length);

const DEBUG = process.env.NODE_ENV !== 'production';

const bodyParser = require('body-parser');
const express = require('express');

const app = express();

/* static public files */
app.use(express.static('../public'));

/* body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.ip, req.method, req.url);
  next();
});

/* routes */
app.get('/', async (req, res, next) => {
  try{
    const response = await { ok: 200 };
    res.send(response);
  } catch (err) {
    return next(err);
  }
});

/* 404 Not Found */
app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(err.message);
});

const SERVER_PORT = process.env.PORT || 4000;
const SERVER_IP_ADDRESS = process.env.IP || '127.0.0.1';

if (!module.parent) {
  app.listen(SERVER_PORT, SERVER_IP_ADDRESS, () => {
    console.log(`Listening on ${SERVER_IP_ADDRESS}, server_port ${SERVER_PORT}`);
  });
}

module.exports = app;

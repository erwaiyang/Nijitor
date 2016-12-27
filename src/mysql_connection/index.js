const mysql = require('mysql');

const DB_CONFIG = require('../../secrets/db');

const pool = mysql.createPool({
  connectionLimit: DB_CONFIG.LIMIT,
  host: DB_CONFIG.HOST,
  user: DB_CONFIG.USER,
  password: DB_CONFIG.PASSWORD,
  database: process.env.NODE_ENV !== 'test' ? DB_CONFIG.DATABASE : DB_CONFIG.DATABASE_TEST,
});

const connect = () =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (connection) connection.release();
        return reject(err);
      }
      return resolve(connection);
    });
  });

const query = async (sql, params) => {
  const connection = await connect();
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (qerr, result) => {
      connection.release();
      return (qerr) ? reject(qerr) : resolve(result);
    });
  });
};

module.exports = { query };

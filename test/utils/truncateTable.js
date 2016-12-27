const query = require('../../src/mysql_connection').query;

module.exports = async function truncateTable(tableName) {
  const sql = `TRUNCATE TABLE ${tableName};`;
  const result = await query(sql);
  return result;
};

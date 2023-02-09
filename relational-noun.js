let Postgres = require('./databases/postgres.js');
let MySql    = require('./databases/mysql.js');

module.exports = {
    Postgres: Postgres,
    MySql: MySql
};
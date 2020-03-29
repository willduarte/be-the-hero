const knex = require("knex");
const configuration = require("../../knexfile");

const dbConfig =
  process.env.NODE_ENV === "test"
    ? configuration.test
    : configuration.development;

const connection = knex(dbConfig);

module.exports = connection;

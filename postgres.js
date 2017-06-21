import knex from 'knex'
import config from './db/postgres.config'

module.exports = knex(config);
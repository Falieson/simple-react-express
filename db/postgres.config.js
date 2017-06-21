module.exports = {
  client: 'pg',
  connection: 'postgres://postgres@localhost:5432/test1706',
  migrations: {
    directory: __dirname + "/migrations",
    tableName: 'migrations',
  },
  seeds: {
    directory: __dirname + "/seeds",
  },
  debug: true,
  pool: {
    min: 2,
    max: 10
  },
};
// id - text
// name - text
// value* - integer (required)
// updatedAt* - datetime (required)
const Counter = require('../factories/counterFactory')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('counters').del()
    .then(function () {
      // Define seed entries
      const counters = [
        new Counter({name: 'First Counter'})
      ]

      // Inserts seed entries
      return knex('counters').insert(counters);
    });
};

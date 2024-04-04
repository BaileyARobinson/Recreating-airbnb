'use strict';
const { Spot } = require('../models')
const { Op } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
      await Spot.bulkCreate([

        {
          ownerId: 1,
          address: '123 Address',
          city: 'City',
          state: 'CA',
          country: 'USA',
          lat: 75.87,
          lng: 34.97,
          name: 'Fun Property',
          description: 'A fun property to visit. A lot of local things to do.',
          price: 40.22,
        },
        {
          ownerId: 2,
          address: '678 address',
          city: 'city as well',
          state: 'ST',
          country: 'Country',
          lat: 34.57,
          lng: 65.93,
          name: 'Another Fun Property',
          description: 'another great property to spend time in. Lots of fun things to do around the area.',
          price: 48.98
        }

      ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {});
  }
};

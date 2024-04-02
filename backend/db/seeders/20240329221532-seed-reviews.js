'use strict';

const { Review } = require('../models')
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
   await Review.bulkCreate([

    {
      spotId: 1,
      userId: 2,
      review: 'This was such an amazing place to stay. Highly reccommend.',
      stars: 5
    },
    {
      spotId: 2,
      userId: 1,
      review: 'This was such an average vacation. I could not be more average.',
      stars: 3
    },
    {
      spotId: 2,
      userId: 2,
      review: 'This was a pretty good vacation spot.',
      stars: 4
    }
   ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options, {});
  }
};

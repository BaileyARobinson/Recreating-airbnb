'use strict';

const { ReviewImage } = require('../models')

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
    await ReviewImage.bulkCreate([

      {
        reviewId: 1,
        url:'https://photos.zillowstatic.com/fp/74b6e9617096a626de4c14083615fc89-sc_1920_1280.webp'
      },
      {
        reviewId:2,
        url:'https://photos.zillowstatic.com/fp/31b071969a541a236a959d40b3001cb5-sc_1920_1280.webp'
      }

    ], { validate:true })

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {});
  }
};

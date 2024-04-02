'use strict';


const { SpotImage } = require('../models')
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
   await SpotImage.bulkCreate([

    {
      spotId: 1,
      url: 'https://photos.zillowstatic.com/fp/e2a5efd3b7a1cfc2fd35fc855d89a4bd-sc_1920_1280.webp',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://photos.zillowstatic.com/fp/e235f748d7ba39613fd09be455304eed-sc_1920_1280.webp',
      preview: true
    }

   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {});
  }
};

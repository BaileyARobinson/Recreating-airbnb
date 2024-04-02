'use strict';
const { User } = require('../models')
const  bcrypt  = require('bcryptjs')
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
   await User.bulkCreate([

    {
      firstName: "it",
      lastName: "me",
      email: "myemail@user.com",
      username: 'it-me',
      hashedPassword: bcrypt.hashSync('password')
    }, {
      firstName: "itstill",
      lastName: "Me",
      email: 'username@myemail.com',
      username: 'itstillme',
      hashedPassword: bcrypt.hashSync('password2')
    }

   ], { vaidate: true });
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]:  ['it-me', 'itstillme',] }
    }, {});
  }
};

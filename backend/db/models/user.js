'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId'

      })
      User.hasMany(models.Booking, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Review, {
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        name: "User already exists",
        msg: "User with that username already exists"},
      validate: {
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Username cannot be an email")
          }
        },
        len: [4, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        name: "User already used email",
        msg: "User with that email already exists"
      },
      validate: {
        isEmail: true,
        len: [3, 256]
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60,60]
      },  
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    }
    
  });
  return User;
};
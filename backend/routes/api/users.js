// backend/routes/api/users.js
const express = require('express')
const router = express.Router();

const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');




  const validateSignup = [
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required.'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required.'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 }),
      //.withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

  // CHECK EMAIL MIDDLEWARE
const checkEmail = async (req, res, next) => {
  const { email } = req.body;
  let existing = await User.findOne({
    where: { email: email}
  }); 

  if (existing) {
    res.status(500).json({
      message: "User already exists",
      errors: {
        email: "User with that email already exists" 
      }
    }); 
  }
  next(); 
}

// CHECK USERNAME MIDDLEWEAR
const checkUsername = async (req, res, next) => {
  const { username } = req.body;
  let existing = await User.findOne({
    where: { username: username}
  }); 

  if (existing) {
    res.status(500).json({
      message: "User already exists",
      errors: {
        username: "User with that username already exists" 
      }
    }); 
  } else {
    next(); 
  }
  
}




  router.post(
    '/',
   [validateSignup, checkEmail, checkUsername] ,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);


      return res.json({
        user: safeUser
      });
    }
  );









module.exports = router;
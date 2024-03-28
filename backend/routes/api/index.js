const router = require('express').Router();
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js');

// backend/routes/index.js
// ...


router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
// ...

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

  // backend/routes/api/index.js
// ...



//FOR TESTING IN SETUP 
// GET /api/set-token-cookie

// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'it-me'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

//backend/routes/api/index.js
//...

// GET /api/restore-user
router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

//END TESTING CODE 




module.exports = router;
const express = require(`express`);
const authController = require(`../controllers/auth-controller`);
//const { authenticate } = require(`../Middleware/role-auth`);
const router = express.Router();

/* ------------User Auth Routes-------------- */
router.post('/user/sign-up', authController.loginUser);

router.post('/user/sign-in', authController.createUser);

module.exports = router;
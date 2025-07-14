const express = require(`express`);
const authController = require(`../controllers/auth-controller`);
const { authenticate } = require(`../Middleware/role-auth`);
const router = express.Router();

/* ------------User Auth Routes-------------- */
router.post('/user/sign-in', authController.loginUser);

router.post('/user/sign-up', authController.createUser);

/* ----------User Data Updation Routes------------ */

router.patch('/user/buyer/:id', authenticate(['buyer']), authController.updateBuyerData);

router.patch('/user/vendor/:id', authenticate(['vendor']), authController.updateVendorData);

module.exports = router;
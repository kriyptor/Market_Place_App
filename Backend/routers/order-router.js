const express = require(`express`);
const orderController = require(`../controllers/order-controller`);
const { authenticate } = require(`../Middleware/role-auth`);
const router = express.Router();

/* ---------- Order Data Routes------------ */

router.get('/buyer/details', authenticate(['buyer']), orderController.getUserOrders);

router.get('/vendor/details', authenticate(['vendor']), orderController.getVendorOrders);

module.exports = router;
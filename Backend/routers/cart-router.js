const express = require('express');
const cartController = require('../controllers/cart-controller');
const { authenticate } = require(`../Middleware/role-auth`);
const router = express.Router();

/* ------------Product CRUD Routes-------------- */

router.get('/cart', authenticate(['buyer']), cartController.getTheCart); // Get cart

router.post('/cart/items', authenticate(['buyer']), cartController.addProductToCart); // Add product to cart

router.patch('/cart/items/:id', authenticate(['buyer']), cartController.updateProductQtyInCart); // Update quantity

router.delete('/cart/items', authenticate(['buyer']), cartController.checkoutFromCart); // Remove all items (checkout/empty cart)

router.delete('/cart/items/:id', authenticate(['buyer']), cartController.removeProductFromCart); // Remove specific product

module.exports = router;
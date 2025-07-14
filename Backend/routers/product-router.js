const express = require('express');
const productController = require('../controllers/product-controller');
//const { authenticate } = require(`../Middleware/role-auth`);
const router = express.Router();

/* ------------Product CRUD Routes-------------- */
router.get('/products', productController.getAllProducts); // Get all products

router.get('/products/:id', productController.getSingleProduct); // Get single product

router.post('/products', productController.createProduct); // Create product

router.patch('/products/:id', productController.updateSingleProduct); // Update product

router.delete('/products/:id', productController.deleteSingleProduct); // Delete product

module.exports = router;
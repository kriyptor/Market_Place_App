const mongoose = require('mongoose');
const { Product } = require(`../models/product-model`);



/* ----- Get Controller ------ */

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitPointer = parseInt(req.query.limit) || 15;
    const skipPointer = (page - 1) * limitPointer;

    const allProductData = await Product
      .find({})
      .sort({ createdAt: -1 })
      .skip(skipPointer)
      .limit(limitPointer)
      .toArray(); // to convert cursor object into js array

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      data: allProductData,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalProducts / limitPointer),
        totalProducts,
        hasNextPage: page < Math.ceil(totalProducts / limitPointer),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(`We got ans error: ${error}`)
    res.status(500).json({ message: "Error fetching products" });
  }
};


exports.getSingleProduct = async (req, res) => {
  try {
    
    const productId = req.params.id;

    if(!mongoose.isValidObjectId(bookId)){
      return res.status(400).json({ error : 'Invalid product ID format' });
    };

    const singleProduct = await Product.findById(productId);

    if(!singleProduct){
      return res.status(400).json({ error : 'Product not find!' });
    }

    res.status(200).json({
      message : 'Success',
      data: singleProduct,
    });

  } catch (error) {
    console.log(`We got ans error: ${error}`)
    res.status(500).json({ message: "Error fetching product" });
  }
};


/* -------- Create Controller --------- */

exports.createUser = async (req, res) => {
  try {
    const { userName, email, phone, password, role } = req.body;

    // Validate inputs
    if (isStringInvalid(userName) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: 'User already exists!'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUserData = {
      userName,
      email,
      phone,
      password: hashedPassword,
      role: role || 'buyer'
    };

    const user = new User(newUserData);
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Successfully created new user'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
const { User } = require('../models/user-model');
const jwt = require(`jsonwebtoken`);
const bcrypt = require('bcrypt');

function isStringInvalid(string) {
  return string === undefined || string.length === 0;
}

const generateAccessToken = (id, role) => {
    return jwt.sign({ id: id, role: role }, process.env.JWT_SECRET_KEY );
  };


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

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Explicitly select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist!'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials!'
      });
    }

    const token = generateAccessToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token
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
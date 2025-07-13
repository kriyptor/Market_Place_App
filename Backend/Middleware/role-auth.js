const { User } = require('../models/user-model');
const jwt = require('jsonwebtoken');


exports.authenticate = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {

      if (allowedRoles.length === 0) {
        return res.status(500).json({ success: false, message: 'At least one role is required for validation!' });
      }

      // Get token from Authorization header
      const token = req.header('Authorization');
      if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied. No token Provided!' });
      }

      // Verify token
      const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const { id, role } = decodedData;


      /* Validating the role */
      if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ success: false, message: 'Insufficient permissions' });
      }

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = user; // Attach user to request

      next(); // Pass control to next middleware/route

    } catch (error) {
      console.log('Authentication error:', error);
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };
};
const httpStatus = require('http-status');
const ApiError = require('../utils/APIError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth =
  (requiredRole = null) =>
  async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    try {
      const varified = jwt.verify(token, config.jwt.secret);
      req.user = varified;
      if (requiredRole && requiredRole !== varified.role) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Not enough rights'));
      }
      next();
    } catch (err) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid Token'));
    }
  };

module.exports = auth;

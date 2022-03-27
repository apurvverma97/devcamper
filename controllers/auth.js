const User = require("../models/users");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc Register a new user
// @route POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, password, email, role } = req.body;

  const user = await User.create({
    name,
    password,
    email,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are present
  if (!email || !password) {
    next(new ErrorResponse(`Please enter email and password`, 400));
  }

  // Check if email exists in db
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse(`Unauthorized`, 401));
  }

  // Match password
  const isAuthorized = user.matchPassword(password);

  if (!isAuthorized) {
    return next(new ErrorResponse(`Unauthorized`, 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc Get user from token
// @route POST /api/v1/auth/me
// @access Public

exports.me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  return res.status(200).json({
    success: true,
    data: user
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwt();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
  });
};

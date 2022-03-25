const User = require("../models/users");
const asyncHandler = require("../middlewares/async");
const errorHandler = require("../middlewares/error");
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

  const token = await user.getSignedJwt();

  res.status(200).json({
    success: true,
    data: user,
    token: token
  });
});


// @desc Login
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are present
  if(!email || !password){
    next(new ErrorResponse(`Please enter email and password`, 400));
  }

  // Check if email exists in db


})

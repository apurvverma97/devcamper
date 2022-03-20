const User = require("../models/users");
const asyncHandler = require("../middlewares/async");
const errorHandler = require("../middlewares/error");

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

  res.status(200).json({
    success: true,
    data: user
  });
});

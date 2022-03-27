const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  // Validate request headers of authorization
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    }

  // else if(req.cookies){

  // }

  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));}
  try {
    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Search for user in mongo
    req.user = await User.findById(decoded.id);
    next();} 
    catch (error) {
      console.log(error);
    return next(new ErrorResponse(`Not authorized to access this route`, 401));}
});

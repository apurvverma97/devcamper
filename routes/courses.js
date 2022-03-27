const express = require("express");
const Course = require("../models/courses");
const advancedResults = require("../middlewares/advancedResults");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth");
const {
  getCourse,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advancedResults(Course), getCourses)
  .post(isAuthenticated, isAuthorized("publisher", "admin"), createCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(isAuthenticated, isAuthorized("publisher", "admin"), updateCourse)
  .delete(isAuthenticated, isAuthorized("publisher", "admin"), deleteCourse);

module.exports = router;

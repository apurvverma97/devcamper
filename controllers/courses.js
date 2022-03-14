const Course = require("../models/courses");
const Bootcamp = require("../models/bootcamps");
const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/async");
const errorResponse = require("../utils/errorResponse");

// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name createdAt",
    });
  }
  const courses = await query;
  return res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc  Get single course
// @route GET /api/v1/courses/:id
// @access public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById({ _id: req.params.id }).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new errorResponse(`No course found with id of: ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Create Course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @acess private

exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById({ _id: req.params.bootcampId });
  if (!bootcamp) {
    return next(
      new errorResponse(
        `No bootcamp resource with id of ${req.params.bootcampId}`,
        404
      )
    );
  }
  const course = await Course.create(req.body);
  return res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc Update Course
// @route PUT /api/v1/courses/:id
// @access private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return res.status(400).json({
      success: false,
    });
  }

  return res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Delete Course
// @route DELETE /api/v1/courses/:id
// @access private

exports.deleteCourse = asyncHandler(async (req,res,next) => {
    const course = await Course.findById(req.params.id);

    if(!course){
        return res.status(400).json({
            success: false
        });
    }

    course.remove();
    return res.status(200).json({
        success: true,
        data: course
    });
});

const Course = require('../models/courses');
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    console.log
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    }
    else {
        query = Course.find();
    }

    const Courses = await query;
    return res.status(200).json({
        success: true,
        count: Courses.length,
        data: Courses
    });
});

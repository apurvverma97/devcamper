const Course = require("../models/courses");
const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/async");

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    }
    else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name createdAt'
        });
    }

    const courses = await query;
    return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });

});
const Course = require("../models/courses");
const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/async");
const errorResponse = require("../utils/errorResponse");


// @desc Get all courses
// @route /api/v1/courses
// @route /api/v1/bootcamps/:bootcampId/courses
// @access public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });}
    else {
        query = Course.find().populate({
                path: 'bootcamp',
                select: 'name createdAt'});}
    const courses = await query;
    return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});


// @desc  Get single course
// @route /api/v1/courses/:id
// @access public

exports.getCourse = asyncHandler( async(req, res, next) => {
    const course = await Course.findById({ _id: req.params.id }).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course){
        return next(new errorResponse(`No course found with id of: ${ req.params.id }`, 404));
    }

    return res.status(200).json({
        success: true,
        data: course
    });

});
const path = require('path');
const Bootcamp = require('../models/bootcamps');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps/
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    //loop over removefields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // SELECT fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // SORT
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {
        query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const pagination = {};

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    //console.log(query);

    //Executing query
    const bootcamps = await query;

    res.status(200).json({
        success: true, count: bootcamps.length,
        pagination: pagination, data: bootcamps
    });
})

// @desc   Get bootcamp by id
// @route  GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
})

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps/
// @access Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
})

// @desc   Update bootcamp by id
// @route  PUT /api/v1/bootcamps/:id
// @access Public
exports.updateBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
})

// @desc   Delete bootcamp by id
// @route  DELETE /api/v1/bootcamps/:id
// @access Public
exports.deleteBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return res.status(400).json({ success: false });
    }

    bootcamp.remove();
    res.status(200).json({ success: true, data: {} });
})

// @desc   Get bootcamps within a radius
// @route  GET /api/v1/bootcamps/radius/:zipcode/:distance/
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distby radius of Earth
    // Earth radius = 3,963 mi / 6,378 km
    const radius = distance / 3959;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})

// @desc Photo upload for bootcamp
// @route PUT /api/v1/bootcamps/:id/photos
// @access public

exports.uploadBootcampPhoto = asyncHandler( async (req,res,next) => {

    let bootcamp;
    if(req.params.id){
        bootcamp = await Bootcamp.findById(req.params.id);   
    }

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Validation image should be having mimetype starting with image
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check for file size
    if(file.size > process.env.MAX_FILE_SIZE){
        return next(new ErrorResponse('Bad image', 400));
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_DIRECTORY}/${file.name}`, async err => {
        if(err){
            console.log(err);
            return next(new ErrorResponse('Error occured while upload', 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: `${file.name}`
        });

        return res.status(200).json({
            success: true,
            data: {
                file: file.name
            }
        })
    });
});
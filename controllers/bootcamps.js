const Bootcamp = require('../models/Bootcamps');
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder')

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps/
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query;

    // Copy req.query
    const reqQuery = {...req.query };

    //Fields to exclude
    const removeFields = ["select", "sort"];

    //loop over removefields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding resource
    query = Bootcamp.find(JSON.parse(queryStr));

    // SELECT fields
    if(req.query.select ){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // SORT
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else{
        query = query.sort("-createdAt");
    }

    //console.log(query);

    //Executing query
    const bootcamps = await query;
   
    res.status(200).json({ success: true, data: bootcamps });
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
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
})

// @desc   Get bootcamps within a radius
// @route  GET /api/v1/bootcamps/radius/:zipcode/:distance/
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next)  => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distby radius of Earth
    // Earth radius = 3,963 mi / 6,378 km
    const radius = distance / 3959 ;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
 
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})
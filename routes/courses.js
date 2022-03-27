const express = require('express');
const Course = require('../models/courses');
const advancedResults = require('../middlewares/advancedResults');
const { isAuthenticated } = require('../middlewares/auth');
const { getCourse,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse } = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(Course), getCourses)
                 .post(isAuthenticated, createCourse);
router.route('/:id').get(getCourse)
                    .put(isAuthenticated, updateCourse)
                    .delete(isAuthenticated, deleteCourse);

module.exports = router;

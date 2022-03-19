const express = require('express');
const Course = require('../models/courses');
const advancedResults = require('../middlewares/advancedResults');
const { getCourse,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse } = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(Course), getCourses)
                 .post(createCourse);
router.route('/:id').get(getCourse)
                    .put(updateCourse)
                    .delete(deleteCourse);

module.exports = router;
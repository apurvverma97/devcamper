const express = require("express");
const { getCourse,
    getCourses,
    createCourse,
    updateCourse } = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses)
                 .post(createCourse);
router.route('/:id').get(getCourse).put(updateCourse);

module.exports = router;
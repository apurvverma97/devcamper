const express = require("express");
const { getCourse,
    getCourses,
    createCourse } = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses)
                 .post(createCourse);
router.route('/:id').get(getCourse);

module.exports = router;

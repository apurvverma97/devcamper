const express = require("express");
const { getCourse,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse } = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses)
                 .post(createCourse);
router.route('/:id').get(getCourse)
                    .put(updateCourse)
                    .delete(deleteCourse);

module.exports = router;
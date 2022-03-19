const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
  },
  scholarshsipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

// Static method to get average cost of courses
CourseSchema.statics.getAverageCost = async function (bootcampid) {
  const obj = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampid,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: {
          $avg: "$tuition",
        },
      },
    },
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampid, {
        averageCost: obj[0].averageCost
    });
  } catch (error) {
    console.error(error);
  }
};

// Update average cost after addition of course
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});
// Update average cost after removal of course
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);

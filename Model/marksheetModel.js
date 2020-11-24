const mongoose = require('mongoose');

const marksheetSchema = mongoose.Schema({
  subjects: [
    {
      name: {
        type: String,
        trim: true,
        require: [true, 'Marksheet Must contain Subject name'],
      },
      obtainedMarks: {
        type: Number,
        min: [0, 'Marks must be above or equal to 0'],
        max: [100, 'Marks must be less than or equal to 100'],
        required: [true, 'Marksheet Must contain Subject Marks'],
      },
    },
  ],
  minMarks: {
    type: Number,
    require: [true, 'Marksheet must have  a Minimum Marks!'],
  },
  minSubject: {
    type: String,
    trim: true,
    require: [true, 'Marksheet Must contain Subject name'],
  },
  maxMarks: {
    type: Number,
    require: [true, 'Marksheet must have  a Maximum Marks!'],
  },
  maxSubject: {
    type: String,
    trim: true,
    require: [true, 'Marksheet Must contain Subject name'],
  },
  totalMarks: {
    type: Number,
    require: [true, 'Marksheet must have  a Maximum Marks!'],
  },
  percentage: {
    type: Number,
    require: [true, 'Marksheet must have percentage!'],
  },
});

const Marksheet = mongoose.model('Marksheet', marksheetSchema);
module.exports = Marksheet;

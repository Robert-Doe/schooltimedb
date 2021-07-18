const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: String,
    code: String,
    dept_id: String,
    course_abbr: String,
    credit: Number,
    details: String
})

module.exports = new mongoose.model('Courses', courseSchema);
const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: String,
    dept_id: String,
    _id: String,
    credit: Number,
})

module.exports = new mongoose.model('Courses', courseSchema);
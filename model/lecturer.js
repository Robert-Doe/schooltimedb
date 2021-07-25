const mongoose = require('mongoose')

const lecturerSchema = new mongoose.Schema({
    _id:String,
    fname: String,
    lname: String,
    dept_id: String,
    courses: Array,
    sessions: Array,
    detail: String
})

module.exports = new mongoose.model('Lecturers', lecturerSchema)
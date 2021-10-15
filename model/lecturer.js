const mongoose = require('mongoose')

const lecturerSchema = new mongoose.Schema({
    _id:String,
    fname: String,
    lname: String,
    dept_id: String,
    abbr: String
})

module.exports = new mongoose.model('Lecturers', lecturerSchema)
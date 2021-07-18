const mongoose = require('mongoose')

const hallSchema = new mongoose.Schema({
    name: String,
    location: String,
    size: Number,
    type: String,
})

module.exports = new mongoose.model('Halls', hallSchema)
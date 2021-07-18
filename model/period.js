const mongoose = require('mongoose')

const periodSchema = new mongoose.Schema({
    _id: String,
    start: String,
    end: String,
})

module.exports = new mongoose.model('Period', periodSchema);
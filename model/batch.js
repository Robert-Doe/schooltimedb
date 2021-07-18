const mongoose = require('mongoose')

const batchSchema = new mongoose.Schema({
    year: String,
    size: Number,
    dept_id: String,
    name: String,
    class_size: Number
})

module.exports = new mongoose.model('Batch', batchSchema);
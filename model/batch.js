const mongoose = require('mongoose')

const batchSchema = new mongoose.Schema({
    _id:String,
    year: String,
    size: Number,
    dept_id: String,
    name: String,
    class_size: Number,
    pairings:{ type: Array, default: [] }
})

module.exports = new mongoose.model('Batch', batchSchema);
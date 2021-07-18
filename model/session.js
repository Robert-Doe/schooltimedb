const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    pair_id: String,
    hall_id: String,
    period: String,
    batch: String
})

module.exports = new mongoose.model('Sessions', sessionSchema)
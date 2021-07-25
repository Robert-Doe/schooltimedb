const mongoose = require('mongoose')

const pairingSchema = new mongoose.Schema({
    _id:String,
    lecturer_id: String,
    course_id: String
})

module.exports = new mongoose.model('Pairings', pairingSchema)
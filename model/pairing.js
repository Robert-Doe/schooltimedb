const mongoose = require('mongoose')

const pairingSchema = new mongoose.Schema({
    lecturer_id: String,
    course_id: String
})

module.exports = new mongoose.model('Pairings', pairingSchema)
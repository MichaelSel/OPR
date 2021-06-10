const mongoose = require('mongoose')

const journalSchema = new mongoose.Schema({
    JournalName: {type: String, required:true}, //Name of journal
})

module.exports = mongoose.model('Journal',journalSchema)
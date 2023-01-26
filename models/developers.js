const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const developerSchema = new Schema({
    name:String
})
module.exports = mongoose.model('Developer',developerSchema)
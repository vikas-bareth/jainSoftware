const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema;

const projectSchema = new Schema({
	title:String,
	description:String,
    start:Date,
    deadline:Date,
    status:Number,
    manager:String,
    developer:String,
    users:[{
		type:Schema.Types.ObjectId,
		ref:'User'
	}]
});

module.exports = mongoose.model('Project',projectSchema)

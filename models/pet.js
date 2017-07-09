const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//New keyword will creat the function and create a copy or clone of it.
//This is the DATA in the API.
const petSchema = new Schema({
	name: String,
	photo: String,
	description: {
		type: String,
		default: ''
	},
	score: {
		type: Number,
		default: 0
	}
});


//This tells mongoose & mongod later this is our data for each PET.
//If we didn't have a pets collection is would create one.
module.exports = mongoose.model('Pet', petSchema);
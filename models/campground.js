const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// making our schema
const campgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', campgroundSchema);


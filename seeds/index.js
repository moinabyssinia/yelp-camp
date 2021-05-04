/* this is self-contained
   it's going to connect to monggose and 
   will use the created model
*/

const mongoose = require('mongoose');

/* use ./ to access data from the same folder
   use ../ to access data from another folder
*/
const Campground = require('../models/campground');
const cities = require('./cities') // get json file 

// import json files
const { places, descriptors } = require('./seedHelpers');

// connection stuff
mongoose.connect('mongodb://localhost:27017/yelp-camp',{ 
    useNewUrlParser:true, 
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// generate random city combinations
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({}); // clean up old data
    // to get random camping names - helps to avoid redundancy in development
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);

        // randomize for naming
        const randPlace = sample(places);
        const randDesc = sample(descriptors);

        const camp = new Campground({
            title : `${randDesc}_${randPlace}`,
            location : `${cities[i].city}, ${cities[i].state}`

        });
        await camp.save();

    }
} 

// execute and close the database connection
seedDB()
.then(() => {
    mongoose.connection.close()
});
/* this is self-contained
   it's going to connect to monggose and 
   will use the created model
*/

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('/cities') // get json file 

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

const seedDB = async() => {
    await Campground.deleteMany({}); // clean up old data
    // to get random camping names
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location : `${cities[i].cities}, ${cities[i].state}`

        });
        await camp.save();

    }
} 

// execute
seedDB();
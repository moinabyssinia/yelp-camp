const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

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

const app = express();


// configurations
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// to be able to parse the body of the form
app.use(express.urlencoded({extended : true}))

/* routes */
// home
app.get('/', (req, res) => {
    res.render('home')
})

// all campgrounds listed
app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({});
    // console.log(camps);
    res.render('./campgrounds/index', { camps });
})

// serve the form to add new campgrounds
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// get data from form and push to database - use parser from above
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

// show details of each camp
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    console.log( id );
    const camp = await Campground.findById({ _id : id });
    res.render('campgrounds/show', { camp })
})

app.listen(5000, () => {
    console.log('serving on port 5000');
})
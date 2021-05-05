const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

// use this to override post with put
const methodOverride = require('method-override');

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

app.use(methodOverride('_method'));
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
    console.log(camp);
    res.render('campgrounds/show', { camp })
})

// serve upadting route form
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById({ _id : id});
    res.render('campgrounds/edit', { camp }); // dont use / in render
})

// get updating data and push it to database
app.put('/campgrounds/:id', async (req, res) => {
    const updatedCamp = req.body.campground;
    console.log(updatedCamp);
    const { id } = req.params;
    const oldCamp = await Campground.findByIdAndUpdate( 
        id, updatedCamp, { runValidators : true, new : true})
    res.redirect(`/campgrounds/${id}`);
})

// delete route - will need a form in the ejs file
app.delete('/campgrounds/:id', async (req, res) => {
    console.log(`Deleting ${req.params.id}`);
    const id = req.params.id;
    console.log(id);
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(5000, () => {
    console.log('serving on port 5000');
})
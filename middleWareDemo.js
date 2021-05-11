const express = require('express');
const app = express();
const morgan = require('morgan');

// tell the app to use morgan
// app.use allows us run code on every single request
app.use(morgan('dev'));


/* app.use((req, res, next) => {
    console.log("testing middleware");
    console.log(Date.now()); // print out time of execution 
    next();
    console.log("finish line of my middleware");
}) */

// middleware that runs for all requests
app.use((req, res, next) => {
    req.reqTime = Date.now(); // assigining current time to req
    console.log(req.method, req.path, res.statusCode);
    next(); 
})

// middleware that runs only on the specified route
app.use('/dogs', (req, res, next) => {
    console.log("dogs are awesome!");
    next();
})




// routes
app.get('/', (req, res) => {
    console.log(`request time is ${req.reqTime}`);
    res.send('Home Page')
})


app.get('/dogs', (req, res) => {
    console.log(`request time is ${req.reqTime}`);
    res.send("barking dog!")
})


/* this middleware runs if none of the routes 
   are executed
*/
app.use((req, res) => {
    console.log("Not Found");
})

app.listen(7000, () => {
    console.log('app running on localhost:7000');
})
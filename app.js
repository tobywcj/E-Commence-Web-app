if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); // run and parse ejs
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const sneaksAPI = require('sneaks-api');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');

// Organise routes
const userRoutes = require('./routes/users');
const shopRoutes = require('./routes/shops'); 
const reviewRoutes = require('./routes/reviews');



mongoose.set('strictQuery', true); // ensure that only the fields that are specified in your schema will be saved in the database
mongoose.connect('mongodb://localhost:27017/SneakerApp', { 
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}).catch(error => console.log(error));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"))
db.once("open", () => console.log("Database connected successfully\n"));

const app = express();
const sneaks = new sneaksAPI();


app.engine('ejs', ejsMate); // tell Express use this engine instead of the default one
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // use path.join coz requiring auto find this directory during starting up the server

app.use(express.urlencoded({ extended: true })); // parse the request body, so that we can access the data from the form, but must use multipart data form if containing files in the form
app.use(methodOverride('_method')); // pass in the string format for the query string
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public'))); // use the public folder to serve static files like images, css, js, etc.


// session middleware
const sessionConfig = {
    secret: 'thisshouldnotbesecret', // secret is used to encrypt the session cookie
    resave: false, // resave = false means that if the session is not modified, then it won't be saved again
    saveUninitialized: true, // unintialized = new but not been modified, true means that if the user is not logged in, but still save the session
    cookie: {
        httpOnly: true, // httpOnly = true means that the cookie cannot be accessed from the client side
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // the cookie will expire in 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));


app.use(flash()); // one-time pop-up message


// passport middleware (after session middleware)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use the local strategy for authentication with the user model and the authenticate method in the user model required by passportLocalMongoose
passport.serializeUser(User.serializeUser()); // converting an object or data structure into a format that can be easily stored and transmitted (logout)
passport.deserializeUser(User.deserializeUser()); // converting a serialized user object back into a user object with all of its properties and methods intact, retrieves the user's information from the database (login)


// res.locals is an object that provides a way to pass data through the application during the request-response cycle
// before all the routes, so we can use for every route
// must be after passport middleware to use req.user
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // req.user is available in every route ONLY IF in the session
    res.locals.success = req.flash('success'); // success is available in every route
    res.locals.error = req.flash('error'); // error is available in every route
    next();
});


app.use('/', userRoutes);
app.use('/shops', shopRoutes); // use the shops router for the '/shops' routes
app.use('/shops/:id/reviews', reviewRoutes); // use the reviews router for the '/reviews' routes




app.get('/home', (req, res) => {
    // getMostPopular(limit, callback) takes in a limit and returns an array of the current popular products curated by StockX
    sneaks.getMostPopular(10, function (err, products) {
        // res.send(products);
        res.render('home', { products });
    })
})


// catch all routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; // not updating the err.message property if default in destructing
    if (!err.message) err.message = 'Something went wrong'; 
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('Serving on port 3000');
})
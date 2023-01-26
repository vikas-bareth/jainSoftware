const port = process.env.PORT || 5000;
//Requiring modules&dependencies
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')

//Requiring models
const User = require('./models/user');
const Developer = require('./models/developers')

//Requiring routes
const projectRoutes = require('./routes/projects')
const userRoutes = require('./routes/users')

//*****************Database******************
mongoose.connect('mongodb://localhost:27017/jainSoftware',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
//******************Defining App and its engines to use******************
const app = express()

app.engine('ejs',engine);
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUnitialized: true,
	cookie:{
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge:1000 * 60 * 60 * 24 * 7

	}
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})

//router middleware
app.use('/projects',projectRoutes)
app.use('/',userRoutes);

app.get('/',(req,res) => {
    res.render('home');
})

app.get('/fakeuser',catchAsync(async (req,res) => {
	const user = new User({ email:'example@gmail.com',username:'example'})
	const newUser = await User.register(user,'chicken')
	res.send(newUser)
}))

app.get('/developer',async(req,res) => {
	const developer = new Developer({name:'AKASH'})
	await developer.save();
	res.send(developer)
})

//******************Error Handling******************
app.use((err,req,res,next) => {
	const {statusCode=500} = err;
	if(!err.message) err.message = 'Oh no Something went wrong!!'
	res.status(statusCode).render('error',{err});
})

app.listen(port,() => {console.log(`App listening on Port ${port}`)});
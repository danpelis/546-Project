const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const seed = require("./tasks/seed");

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
	session({
		name: 'AuthCookie',
		secret: "Secret String",
		saveUninitialized: true,
		resave: false
	})
);

app.use('/user/save', (req, res, next) => {
	if (!req.session.user) {
		req.method = 'GET'
		return res.redirect('/');
	} else {
		next();
	}
});

app.use('/user/load', (req, res, next) => {
	if (!req.session.user) {
		req.method = 'GET'
		return res.redirect('/');
	} else {
		next();
	}
});

app.use((req, res, next)=>{
    try{
		const timeStamp = new Date().toUTCString();
		let sta = "(Non-Authenticated User)";
		if(req.session.user) sta = "(Authenticated "+req.session.user.username +")";
		console.log("("+timeStamp+"): "+req.method+"   "+req.originalUrl+"   "+sta);
	}
	catch(e){
		console.log("timeStamp error:"+e);
	}
    next();
})

try{
	seed.main();
}catch(e){
	console.log('Error: Could not seed maps');
	console.log(`Error: ${e}`)
}

try{
	configRoutes(app);
}catch(e){
	console.log(e);
}

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});



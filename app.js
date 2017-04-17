'use strict';
var express = require('express'),
	app = express(),
	path = require('path'),
	config = require('./config/config.js'),
	mongoose = require('mongoose').connect(config.dbURL),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	facebookStrategy = require('passport-facebook').Strategy,
	rooms = [],
	connectMongo = require('connect-mongo')(session);
	
app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
var env = process.env.NODE_ENV || 'development';
if(env === 'development')
	{
	app.use(session({secret: config.sessionSecret,
	 saveUninitialized: true, resave: true}));	
	}
else
	{
	app.use(session({
		secret: config.sessionSecret,
	    saveUninitialized: true,
	    resave: true, secure: false,
		store: new connectMongo({	
				mongooseConnection: mongoose.connections[0],
				stringify: true })
	}));
	}
	app.use(passport.initialize());
    app.use(passport.session());
	require('./routes/routes.js')(express, app, passport, config, rooms);
	require('./auth/passportAuth.js')(passport, facebookStrategy, config, mongoose);
app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms );
server.listen(app.get('port'), ()=> {console.log('chatcat app running on prt: '+ app.get('port'));});

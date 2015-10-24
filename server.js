/*
 * SERVER.JS
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config')
  , express = require('express')
  , app = express()
  , resources = require('./resources')
  , db = require('./db')()
  , path = require('path')
  , bodyParser = require('body-parser')
  , flash = require('connect-flash')
  , session = require('express-session')
  // , cookieParser = require('cookie-parser')
  // , cookie = require('cookie')
  , server = app.listen(config.port)
  , io = require('socket.io').listen(server);

// app.use(express.static(__dirname + '/public'));
app.use("/", express.static(path.join(__dirname, 'public')));

require('./sockets/base')(io);

app.use(flash());
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'OurSuperSecretCookieSecret'
}));

// app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

// RESOURCES
app.get('/', resources.index);
app.get('/templates/:name', resources.templates);
require('./resources/posts')(app);

// redirect all others to the index (HTML5 history)
app.get('*', resources.index);

module.exports = server;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);



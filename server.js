process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config')
  , express = require('express')
  , app = express()
  , resources = require('./resources')
  , db = require('./db')()
  , path = require('path')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , flash = require('connect-flash')
  , session = require('express-session')
  , passport = require('./passport')
  , server = app.listen(config.port)
  , io = require('socket.io').listen(server);


require('./sockets/base')(io);
app.set('io', io);
app.set('server', server);

app.use(flash());
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'OurSuperSecretCookieSecret'
}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

app.use('/', express.static(__dirname + '/client'));

// app.use(passport.initialize());
// app.use(passport.session());

// Resources
app.get('/', resources.index);
app.get('/templates/:name', resources.templates);
require('./resources/posts')(app, io);
// app.route('/api/posts').post(create(io));

// redirect all others to the index (HTML5 history)
app.get('*', resources.index);

module.exports = server;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
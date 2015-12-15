/*
 * SERVER.JS
 */

require('dotenv').load();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config')
  , express = require('express')
  , app = express()
  , resources = require('./resources')
  , path = require('path')
  , bodyParser = require('body-parser')
  , flash = require('connect-flash')
  , cors = require('cors')
  , logger = require('morgan')
  , server = app.listen(config.port)
  , mongoose  = require('mongoose')

mongoose.connect(config.db);
// app.use(express.static(__dirname + '/public'));
app.use("/", express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
// TODO: translate to EJS
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

// RESOURCES
app.get('/', resources.index);
app.get('/templates/:name', resources.templates);
require('./resources/users')(app);
require('./resources/questions')(app);
require('./resources/answers')(app);
require('./resources/comments')(app);
require('./resources/votes')(app);

// redirect all others to the index (HTML5 history)
app.get('*', resources.index);

module.exports = server;
console.log('server running at http://localhost:' + config.port);



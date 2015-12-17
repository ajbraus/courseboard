var port = 1337;

module.exports = {
  port: port,
  db: 'mongodb://localhost/ga-qa',
  TOKEN_SECRET: process.env.TOKEN_SECRET
};
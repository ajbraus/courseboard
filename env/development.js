var port = 1337;

module.exports = {
  port: port,
  db: 'mongodb://localhost/basic-auth',
  TOKEN_SECRET: process.env.TOKEN_SECRET
};
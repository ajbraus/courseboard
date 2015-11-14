var port = process.env.PORT;

module.exports = {
  port: port,
  db: process.env.MONGOLAB_URI
};
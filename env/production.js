var port = process.env.PORT || 1337;

module.exports = {
  port: port,
  db: ENV['MONGOLAB_URI']
};
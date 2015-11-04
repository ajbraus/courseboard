var port = process.env.PORT;

module.exports = {
  port: port,
  db: process.env.MONGOLAB_URI,
  email: "zoinksapp@gmail.com",
  emailpass: "Zoinks!@#",
  defaultFromAddress: 'Zoinks App <zoinksapp@gmail.com>'
};
const mongoose = require('mongoose');

module.exports = function connect(url) {
  return mongoose.connect(url, {
    useNewUrlParser: true,
  });
};

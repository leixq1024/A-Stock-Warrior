const fundamental = require('./fundamental');
const technical = require('./technical');
const fundStrategy = require('./fund');

module.exports = {
  fundamental,
  technical,
  fund: fundStrategy
};

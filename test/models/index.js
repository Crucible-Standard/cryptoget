const coin = require('../../src/models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Models', () => {
  describe('formatPast', () => {
    it('it should have successful date calculation', (done) => {
      const response = coin.formatPast('1577561159');
      done();
    });
  });
});

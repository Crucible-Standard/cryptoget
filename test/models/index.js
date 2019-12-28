const coin = require('../../src/models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Models', () => {
  /**
   * Test for root route, with GET request
  **/
  describe('formatPast', () => {
    it('it should have successful date calculation', (done) => {
      const response = coin.formatPast('1577560000');
      // 00:00:00
      response.should.to.be.a('string');
      done();
    });
  });
});

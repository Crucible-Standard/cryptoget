const app = require('../src/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Main', () => {
  /**
   * Test for health route, with GET request
  **/
  describe('/GET health', () => {
    it('it should have successful GET', (done) => {
      chai.request(app)
        .get('/health')
        .end((err, res) => {
          res.should.have.status(200);
          done();
      });
    });
  });
});

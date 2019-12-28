const app = require('../src/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Main', () => {
  /**
   * Test for root route, with GET request
  **/
  describe('/GET coin', () => {
    it('it should have successful GET from /', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
      });
    });

    it('it should have successful GET from /health', (done) => {
      chai.request(app)
        .get('/health')
        .end((err, res) => {
          res.should.have.status(200);
          done();
      });
    });
  });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const port = process.env.PORT = 5050;
const setup = require(__dirname + '/../test_setup');
const teardown = require(__dirname + '/../test_teardown');

var Recipe = require(__dirname + '/../../models/recipe');
var User = require(__dirname + '/../../models/user');

describe('ccbrecipe server', () => {
  before((done) => {
    setup(done);
  });

  after((done) => {
    teardown(done);
  });

  describe('Recipe methods', () => {
    it('should pass temporarily', (done) => {
      expect(true).to.eql(true);
      done();
    });
  });
});

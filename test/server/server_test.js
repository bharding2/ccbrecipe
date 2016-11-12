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
    var userToken = '';
    var fakeToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNDc4OTc5MTc4fQ.JB5gC7TLxMoTvzXP8oKC50Oi6YQJ4R6R9YWn5V_fB4w';

    before((done) => {
      request('localhost:' + port)
        .post('/api/signup')
        .send({ username: 'test', password: 'pass' })
        .end((err, res) => {
          if (err) return console.log(err);
          userToken = res.body.token;
          done();
        });
    });

    describe('POST method', () => {
      it('should POST a new recipe', (done) => {
        request('localhost:' + port)
          .post('/api/recipes')
          .set('token', userToken)
          .send({ name: 'delicious ants' })
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.name).to.eql('delicious ants');
            done();
          });
      });

      it('should error without authorized user', (done) => {
        request('localhost:' + port)
          .post('/api/recipes')
          .set('token', fakeToken)
          .send({ name: 'delicious ants' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should error without valid data', (done) => {
        request('localhost:' + port)
          .post('/api/recipes')
          .set('token', userToken)
          .send({ wrong: 'data' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('error saving recipe');
            done();
          });
      });
    });
  });
});

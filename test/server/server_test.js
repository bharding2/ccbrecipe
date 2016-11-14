const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const port = process.env.PORT = 5050;
const setup = require(__dirname + '/../test_setup');
const teardown = require(__dirname + '/../test_teardown');
var Recipe;
var User;
var connection;

describe('ccbrecipe server', () => {

  before((done) => {
    setup((conn) => {
      Recipe = require(__dirname + '/../../models/recipe')(conn);
      User = require(__dirname + '/../../models/user')(conn);
      connection = conn;
      done();
    });
  });

  after((done) => {
    teardown(connection, done);
  });

  describe('Recipe methods', () => {
    var userToken = '';
    var fakeToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNDc4OTc5MTc4fQ.JB5gC7TLxMoTvzXP8oKC50Oi6YQJ4R6R9YWn5V_fB4w'; // eslint-disable-line max-len

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
      after((done) => {
        Recipe.findOneAndRemove({ name: 'delicious ants' }, done);
      });

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

      it('should not post without authorized user', (done) => {
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

      it('should not post without valid data', (done) => {
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

    describe('the GET method', () => {
      before((done) => {
        var newRecipe = new Recipe({ name: 'vacuum noises', current: true });
        newRecipe.save((err) => {
          if (err) console.log(err);
          done();
        });
      });

      it('should get all the recipes', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/all')
          .set('token', userToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(Array.isArray(res.body)).to.eql(true);
            expect(res.body[0].name).to.eql('vacuum noises');
            done();
          });
      });

      it('should not get all without authorized user', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/all')
          .set('token', fakeToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should get current recipes', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/current')
          .set('token', userToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(Array.isArray(res.body)).to.eql(true);
            expect(res.body[0].current).to.eql(true);
            done();
          });
      });

      it('should not get current without authorized user', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/current')
          .set('token', fakeToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });
    });
  });
});

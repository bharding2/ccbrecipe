const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const port = process.env.PORT = 5050;
const setup = require(__dirname + '/../test_setup');
const teardown = require(__dirname + '/../test_teardown');
var Recipe = {};
var User = {};
var connection = {};

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
    var adminToken = '';
    var fakeToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNDc4OTc5MTc4fQ.JB5gC7TLxMoTvzXP8oKC50Oi6YQJ4R6R9YWn5V_fB4w'; // eslint-disable-line max-len

    before((done) => {
      request('localhost:' + port)
        .post('/api/signup')
        .send({ username: 'test', password: 'pass' })
        .end((err, res) => {
          if (err) console.log(err);
          userToken = res.body.token;
          done();
        });
    });

    before((done) => {
      request('localhost:' + port)
        .post('/api/signup')
        .send({ username: 'admin1', password: 'adminpass1' })
        .end((err, res) => {
          if (err) console.log(err);
          adminToken = res.body.token;

          request('localhost:' + port)
            .get('/api/profile')
            .set('token', adminToken)
            .end((err, res) => {
              if (err) console.log(err.message);

              User.findOneAndUpdate({ _id: res.body.id }, { admin: true }, (err) => {
                if (err) console.log(err);
                done();
              });
            });
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
      var currentUser = {};
      var newRecipe = {};

      before((done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            currentUser = res.body;

            newRecipe = new Recipe({
              name: 'vacuum noises',
              current: true,
              creatorId: currentUser.id
            });

            newRecipe.save((err) => {
              if (err) console.log(err);
              done();
            });
          });
      });

      after((done) => {
        Recipe.findOneAndRemove({ _id: newRecipe._id }, (err) => {
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

      it('should get current user recipes', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/mine')
          .set('token', userToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(Array.isArray(res.body)).to.eql(true);
            expect(res.body[0].name).to.eql('vacuum noises');
            expect(res.body[0].creatorId).to.eql(currentUser.id);
            done();
          });
      });

      it('should not get current user without authorized user', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/mine')
          .set('token', fakeToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should get a specific recipe', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/' + newRecipe._id)
          .set('token', userToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.name).to.eql('vacuum noises');
            done();
          });
      });

      it('should not get a recipe without authorized user', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/' + newRecipe._id)
          .set('token', fakeToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should not get a recipe without a valid recipe id', (done) => {
        request('localhost:' + port)
          .get('/api/recipes/fakerecipeid')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(404);
            expect(res.body.msg).to.eql('recipe not found');
            done();
          });
      });
    });

    describe('the PUT method', () => {
      var currentUser = {};
      var newRecipe = {};
      var adminRecipe = {};

      before((done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            currentUser = res.body;

            newRecipe = new Recipe({
              name: 'termites',
              current: true,
              creatorId: currentUser.id
            });

            newRecipe.save((err) => {
              if (err) console.log(err);
              done();
            });
          });
      });

      before((done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            currentUser = res.body;

            adminRecipe = new Recipe({
              name: 'termites admins',
              current: true,
              creatorId: currentUser.id
            });

            adminRecipe.save((err) => {
              if (err) console.log(err);
              done();
            });
          });
      });

      after((done) => {
        Recipe.findOneAndRemove({ _id: newRecipe._id }, (err) => {
          if (err) console.log(err);
          done();
        });
      });

      after((done) => {
        Recipe.findOneAndRemove({ _id: adminRecipe._id }, (err) => {
          if (err) console.log(err);
          done();
        });
      });

      it('should PUT an update to a recipe', (done) => {
        request('localhost:' + port)
          .put('/api/recipes/' + newRecipe._id)
          .set('token', userToken)
          .send({ name: 'delicious ants' })
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.msg).to.eql('recipe updated by creator');
            done();
          });
      });

      it('should admin PUT an update to a recipe', (done) => {
        request('localhost:' + port)
          .put('/api/recipes/' + adminRecipe._id)
          .set('token', adminToken)
          .send({ name: 'delicious admins' })
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.msg).to.eql('recipe updated by admin');
            done();
          });
      });

      it('should not put without authorized user', (done) => {
        request('localhost:' + port)
          .put('/api/recipes/' + newRecipe._id)
          .set('token', fakeToken)
          .send({ name: 'delicious ants' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should not put without valid data', (done) => {
        request('localhost:' + port)
          .put('/api/recipes/' + newRecipe._id)
          .set('token', userToken)
          .send({ wrong: 'data' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('error updating recipe');
            done();
          });
      });

      it('should not admin put without valid data', (done) => {
        request('localhost:' + port)
          .put('/api/recipes/' + newRecipe._id)
          .set('token', adminToken)
          .send({ wrong: 'data' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('error updating recipe');
            done();
          });
      });

      it('should not put without a valid recipe id', (done) => {
        request('localhost:' + port)
          .put('/api/recipes/fakerecipeid')
          .set('token', userToken)
          .send({ name: 'delicious ants' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(404);
            expect(res.body.msg).to.eql('recipe not found');
            done();
          });
      });

      it('should not admin put without a valid recipe id', (done) => {
        request('localhost:' + port)
          .put('/api/recipes/fakerecipeid')
          .set('token', adminToken)
          .send({ name: 'delicious admins' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(404);
            expect(res.body.msg).to.eql('recipe not found');
            done();
          });
      });
    });

    describe('the DELETE method', () => {
      var currentUser = {};
      var newRecipe = {};
      var adminRecipe = {};

      before((done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            currentUser = res.body;

            newRecipe = new Recipe({
              name: 'human flesh',
              current: true,
              creatorId: currentUser.id
            });

            newRecipe.save((err) => {
              if (err) console.log(err);
              done();
            });
          });
      });

      before((done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            currentUser = res.body;

            adminRecipe = new Recipe({
              name: 'admin flesh',
              current: true,
              creatorId: currentUser.id
            });

            adminRecipe.save((err) => {
              if (err) console.log(err);
              done();
            });
          });
      });

      it('should delete a recipe', (done) => {
        request('localhost:' + port)
          .delete('/api/recipes/' + newRecipe._id)
          .set('token', userToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.msg).to.eql('recipe deleted by creator');
            done();
          });
      });

      it('should admin delete a recipe', (done) => {
        request('localhost:' + port)
          .delete('/api/recipes/' + adminRecipe._id)
          .set('token', adminToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.msg).to.eql('recipe deleted by admin');
            done();
          });
      });

      it('should not delete without authorized user', (done) => {
        request('localhost:' + port)
          .delete('/api/recipes/' + newRecipe._id)
          .set('token', fakeToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should not delete without a valid recipe id', (done) => {
        request('localhost:' + port)
          .delete('/api/recipes/fakerecipeid')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(404);
            expect(res.body.msg).to.eql('recipe not found');
            done();
          });
      });
    });
  });

  describe('User methods', () => {
    var userToken = '';
    var nonAdminToken = '';
    var fakeToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNDc4OTc5MTc4fQ.JB5gC7TLxMoTvzXP8oKC50Oi6YQJ4R6R9YWn5V_fB4w'; // eslint-disable-line max-len

    before((done) => {
      request('localhost:' + port)
        .post('/api/signup')
        .send({ username: 'test5', password: 'pass5' })
        .end((err, res) => {
          if (err) console.log(err);
          nonAdminToken = res.body.token;
          done();
        });
    });

    before((done) => {
      request('localhost:' + port)
        .post('/api/signup')
        .send({ username: 'test2', password: 'pass2' })
        .end((err, res) => {
          if (err) console.log(err);
          userToken = res.body.token;

          request('localhost:' + port)
            .get('/api/profile')
            .set('token', userToken)
            .end((err, res) => {
              if (err) console.log(err.message);

              User.findOneAndUpdate({ _id: res.body.id }, { admin: true }, (err) => {
                if (err) console.log(err);
                done();
              });
            });
        });
    });

    describe('user profile route', () => {
      it('should get the current user profile', (done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', userToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.username).to.eql('test2');
            done();
          });
      });

      it('should not get profile without authorized user', (done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', fakeToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });
    });

    describe('the GET method', () => {
      var currentUser = {};

      before((done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            currentUser = res.body;
            done();
          });
      });

      it('should get all the users', (done) => {
        request('localhost:' + port)
          .get('/api/users/all')
          .set('token', userToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(Array.isArray(res.body)).to.eql(true);
            expect(res.body[0].username).to.eql('test');
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

      it('should get a specific recipe', (done) => {
        request('localhost:' + port)
          .get('/api/users/' + currentUser.id)
          .set('token', userToken)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.username).to.eql('test2');
            done();
          });
      });

      it('should not get a recipe without authorized user', (done) => {
        request('localhost:' + port)
          .get('/api/users/' + currentUser.id)
          .set('token', fakeToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should not get a recipe without a valid recipe id', (done) => {
        request('localhost:' + port)
          .get('/api/users/fakeuserid')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(403);
            expect(res.body.msg).to.eql('error accessing user');
            done();
          });
      });
    });

    describe('the PUT method', () => {
      var testUser = {};

      before((done) => {
        request('localhost:' + port)
          .post('/api/signup')
          .send({ username: 'test3', password: 'pass3' })
          .end((err, res) => {
            if (err) console.log(err);
            var testToken = res.body.token;

            request('localhost:' + port)
              .get('/api/profile')
              .set('token', testToken)
              .end((err, testRes) => {
                if (err) console.log(err.message);

                testUser = testRes.body;
                done();
              });
          });
      });

      it('should not put without authorized user', (done) => {
        request('localhost:' + port)
          .put('/api/users/' + testUser.id)
          .set('token', fakeToken)
          .send({ username: 'test4' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should not put without admin user', (done) => {
        request('localhost:' + port)
          .put('/api/users/' + testUser.id)
          .set('token', nonAdminToken)
          .send({ username: 'test4' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('unauthorized user update');
            done();
          });
      });

      it('should not put without valid data', (done) => {
        request('localhost:' + port)
          .put('/api/users/' + testUser.id)
          .set('token', userToken)
          .send({ wrong: 'data' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('error updating user');
            done();
          });
      });

      it('should not put without a valid user id', (done) => {
        request('localhost:' + port)
          .put('/api/users/fakerecipeid')
          .set('token', userToken)
          .send({ username: 'test4' })
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(404);
            expect(res.body.msg).to.eql('user not found');
            done();
          });
      });

      it('should PUT an update to a user', (done) => {
        request('localhost:' + port)
          .put('/api/users/' + testUser.id)
          .set('token', userToken)
          .send({ username: 'test4' })
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body.msg).to.eql('user updated');
            done();
          });
      });
    });

    describe('the DELETE method', () => {
      var currentUser = {};

      before((done) => {
        request('localhost:' + port)
          .get('/api/profile')
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            currentUser = res.body;

            done();
          });
      });

      it('should not delete without authorized user', (done) => {
        request('localhost:' + port)
          .delete('/api/users/' + currentUser.id)
          .set('token', fakeToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('Invalid Authentication');
            done();
          });
      });

      it('should not delete without admin user', (done) => {
        request('localhost:' + port)
          .delete('/api/users/' + currentUser.id)
          .set('token', nonAdminToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(401);
            expect(res.body.msg).to.eql('unauthorized user update');
            done();
          });
      });

      it('should delete a user', (done) => {
        request('localhost:' + port)
          .delete('/api/users/' + currentUser.id)
          .set('token', userToken)
          .end((err, res) => {
            if (err) console.log(err.message);
            expect(res.status).to.eql(200);
            expect(res.body.msg).to.eql('user deleted by admin');
            done();
          });
      });
    });
  });
});

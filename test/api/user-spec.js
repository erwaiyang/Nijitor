const expect = require('chai').expect;
const app = require('../../src/server');

const server = app.listen();
const request = require('supertest').agent(server);

const truncateTable = require('../utils/truncateTable');

describe('user API', () => {
  before(async () => {
    await truncateTable('users');
  });

  describe('return 404 if path does not exist', () => {
    it('GET /api/user/whateverNotExists should return 404', (done) => {
      request
        .get('/api/user/dsfskfjskdfjsldfkjdslf')
        .expect(404, 'Not Found')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          if (err) return done(err);
          return done();
        });
    });
  });

  describe('sign up api', () => {
    it('return 400 if any of username or password is not provided', (done) => {
      request
        .post('/api/user/sign_up')
        .expect(400)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          return done();
        });
    });
    it('return 200 if user is created', (done) => {
      const user = { username: 'jean', password: '123' };
      request
        .post('/api/user/sign_up')
        .set('Accept', 'application/json')
        .send(user)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          return done();
        });
    });
    it('return 409 if username is already taken', (done) => {
      request
        .post('/api/user/sign_up')
        .set('Accept', 'application/json')
        .send({ username: 'jean', password: '456' })
        .expect(409)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.text).to.equal('username already exists');
          return done();
        });
    });
  });

  describe('sign in api', () => {
    it('return 400 if any of username or password is not provided', (done) => {
      request
        .post('/api/user/sign_in')
        .expect(400)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          return done();
        });
    });
    it('return 401 if user failed to sign in', (done) => {
      request
        .post('/api/user/sign_in')
        .set('Accept', 'application/json')
        .send({ username: 'wrong_username', password: '123' })
        .expect(401)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('user not found');
        });
      request
        .post('/api/user/sign_in')
        .set('Accept', 'application/json')
        .send({ username: 'jean', password: 'wrong_password' })
        .expect(401)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('user not found');
          return done();
        });
    });
    it('return 200 if user sign in successfully', (done) => {
      request
        .post('/api/user/sign_in')
        .set('Accept', 'application/json')
        .send({ username: 'jean', password: '123' })
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.equal('OK');
          return done();
        });
    });
  });

  after((done) => {
    server.close();
    done();
  });
});

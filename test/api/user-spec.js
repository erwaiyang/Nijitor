const expect = require('chai').expect;
const app = require('../../src/server');

const server = app.listen();
const request = require('supertest').agent(server);

const truncateTable = require('../utils/truncateTable');

describe('user API', () => {
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
    before(async () => {
      await truncateTable('users');
    });

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

  after((done) => {
    server.close();
    done();
  });
});

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');


describe('GET /apps endpoint', () => {
  it('sends back all apps by default', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        //make sure we get an array
        expect(res.body).to.be.an('array');
        //make sure array contains all data
        expect(res.body).to.have.lengthOf(20);
      });
  });
  it('filters by genres', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Puzzle' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body.every(app =>
          app.Genres.includes('Puzzle'))
        ).to.be.true;
      });

  });
});


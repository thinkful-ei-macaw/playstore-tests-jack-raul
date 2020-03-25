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
        expect(res.body.every(app => app.Genres.includes('Puzzle'))).to.be.true;
      });
  });

  ['App', 'Rating'].forEach(sort => {
    it(`sorts by ${sort}`, () => {
      return supertest(app)
        .get('/apps')
        .query({ sort: sort })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          let sorted = true;
          let i = 0;
          while (i < res.body.length - 1) {
            const currentApp = res.body[i];
            const nextApp = res.body[i + 1];
            if (currentApp[sort] > nextApp[sort]) {
              sorted = false;
              break;
            }
            i++;
          }
          expect(sorted).to.be.true;
        });
    });
  });

  it('sends back a 400 error `Sort must be rating or app` when param invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'INVALID-SORT' })
      .expect(400, 'Sort must be rating or app');
  });

  it('it sends back 400 when Genre param is not valid', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'INVALID-GENRE' })
      .expect(
        400,
        'Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card.',
      );
  });
});

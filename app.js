const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore.js');

const app = express();
app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  let { sort, genres } = req.query;
  //Make sure first letter is uppercase to match objects
  sort = sort && sort[0].toUpperCase() + sort.slice(1);
  let results = [...playstore];

  if (sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('Sort must be rating or app');
    }

    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  if (genres) {
    if (
      !['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(
        genres,
      )
    ) {
      return res
        .status(400)
        .send(
          'Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card.',
        );
    }
    results = results.filter(result => {
      console.log(result.Genres);
      if (result.Genres.includes(genres)) {
        return result;
      }
    });
  }

  res.json(results);
});

module.exports = app;

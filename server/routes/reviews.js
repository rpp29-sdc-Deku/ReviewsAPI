const router = require('express').Router();
const redis = require('redis');
const client = redis.createClient(6379);
const { getReviews, getMeta, putHelp, postReview, putReport, postInteraction } = require('../helpers/reviews_helpers.js');

const cache = async (req, res) => {
  const { product_id } = req.query;

  const cachedReviews = client.get(product_id + 'reviews', (err, results) => {
    if (err) throw err;

    if (results !== null) {
      console.log(results);
      res.end(results);
    } else {

    }
  });

  // return cachedReviews;
};

router.get('/reviews', (req, res) => {
  const { product_id } = req.query;
  // console.log(req.query);
  // const { product_id, sort, page, count, query } = req;
  try {
    client.get(product_id + 'reviews', (err, cachedData) => {
      if (err) throw err;

      if (cachedData !== null) {
        res.send(JSON.parse(cachedData));
      } else {
        getReviews(req.query)
          .then(results => {
            // console.log('Reviews from DB:', results);
            client.set(product_id + 'reviews', JSON.stringify(results), (err) => {
              if (err) console.log(err);
            });
            res.send(results);
          }).catch(err => {
            console.error(err.codeName);
            res.sendStatus(500);
            // res.end(JSON.stringify(err));
          });
      }
    });
  } catch (err) {
    console.log('Backstop:', err.codeName);
  };
});

router.put('/reviews/helpful', (req, res) => {
  putHelp(req.body.review_Id).then(response => {
    res.end();
  }).catch(err => res.end(err.stack));
});

router.get('/reviews/meta', (req, res) => {
  const { product_id } = req.query;
  // console.log(req.query);
  // const { product_id, sort, page, count, query } = req;
  try {
    client.get(product_id + 'meta', (err, cachedData) => {
      if (err) throw err;

      if (cachedData !== null) {
        res.send(JSON.parse(cachedData));
      } else {
        getMeta(product_id)
          .then(results => {
            // console.log('Reviews from DB:', results);
            client.set(product_id + 'meta', JSON.stringify(results), (err) => {
              if (err) console.log(err);
            });
            res.send(results);
          }).catch(err => {
            console.error(err.codeName);
            res.sendStatus(500);
            // res.end(JSON.stringify(err));
          });
      }
    });
  } catch (err) {
    console.log('Backstop:', err.codeName);
  };
});

router.put('/reviews/report', (req, res) => {
  putReport(req.body.review_id).then(results => res.end());
});

router.post('/reviews', (req, res) => {
  postReview(req.body).then(response => res.send('Success')).catch(err => console.log(err));
});

router.post('/reviews/interaction', (req, res) => {
  postInteraction(req.body.element);
});

module.exports = router;

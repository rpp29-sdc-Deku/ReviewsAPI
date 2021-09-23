/* eslint-disable camelcase */
const axios = require('axios');
const db = require('../database/mysql.js');
// const db = mysql.connection;

const apiToken = process.env.API_TOKEN;
const apiURL = process.env.API;

axios.defaults.baseURL = apiURL;
axios.defaults.headers.common.Authorization = apiToken;

// TODO: replace all axios HTTP requests with DB queries

const getReviews = ({ product_id, sort = 'newest', page = 1, count = 10 }) => {
  console.log('GET reviews:', product_id, sort);
  const sortOptions = {
    helpful: 'helpfulness',
    newest: 'date',
    relevant: 'helpfulness DESC, date DESC'
  };

  // const reviewsQuery = `
  //     SELECT *
  //     FROM reviews
  //     WHERE product_id=${product_id} AND id >= ${page}
  //     HAVING reported=false
  //     ORDER BY ${sortOptions[sort]}
  //     LIMIT ${count};
  // `;

  // const reviewsQuery = `
  //   SELECT reviews.*
  //   FROM reviews JOIN photos ON reviews.id = photos.review_id
  //   WHERE reviews.product_id=${product_id} AND reviews.id >= ${page}
  //   HAVING reported=false
  //   ORDER BY ${sortOptions[sort]}
  //   LIMIT ${count};
  // `;
  const reviewsQuery = `
    SELECT reviews.*, photos.id, photos.url
    FROM reviews, photos
    WHERE reviews.product_id=5 AND photos.review_id = reviews.id
  `;

  const photoReviewQuery = `select reviews.*, photos.id as photo_id, photos.review_id, photos.url from reviews INNER JOIN photos ON photos.review_id = reviews.id WHERE reviews.product_id=2;`
  // const photosQuery = `
  //   SELECT (id, url) FROM photos
  //   WHERE photos.review`

  // const query = `
  //   SELECT * FROM reviews
  //   WHERE product_id=${product}
  //   HAVING reported=false
  //   ORDER BY ${sortOptions[sort]}
  //   LIMIT 100
  // `;

  return new Promise((resolve, reject) => {
    db(reviewsQuery)
      .then(results => {
        console.log(results);
        resolve(results);
      })
      .catch(err => {
        console.log(err.stack);
        reject(err.stack);
      });
  });
  // return new Promise((resolve, reject) => {
  //   db(reviewsQuery)
  //     .then(reviews => {
  //       const photosQuery = `
  //         SELECT *
  //         FROM photos
  //         WHERE id IN (${reviews.map(review => review.id).join(', ')})
  //       `;
  //       // console.log(photosQuery);
  //       db(photosQuery).then(photos => {
  //         // const RowDataPacket = { photos: photos };
  //         reviews.photos = photos;
  //         // console.log(reviews);
  //         resolve(reviews);
  //       });
  //     })
  //     .catch(err => {
  //       reject(err.stack);
  //     });
};

const getMeta = (product) => {
  // characteristics, characteristic_ratings,
  const query = `
    SELECT * FROM characteristics WHERE product_id=${product}
  `;

  return new Promise((resolve, reject) => {
    db(query)
      .then(res => {
        console.log('Reviews metadata from DB:', res);
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
  // return axios.get(`reviews/meta/?product_id=${product}`)
  //   .then(results => {
  //     return results.data;
  //   })
  //   .catch(err => {
  //     console.log(err.stack);
  //   });
};

const putHelp = (reviewID) => {
  return axios.put(`reviews/${reviewID}/helpful`, null);
};

const postReview = (obj) => {
  const { product_id, rating, summary, body, recommend, name, email, characteristics } = obj;
  const data = { product_id: product_id, rating: rating, summary: summary, body: body, recommend: recommend, name: name, email: email, characteristics: characteristics, photos: [] };
  return axios.post('reviews', data);
};

const putReport = (reviewID) => {
  return axios.put(`reviews/${reviewID}/report`, null, {
    headers: {
      Authorization: apiToken
    }
  });
};

const fwdQuery = (query) => {
  return db(query);
};

const postInteraction = (element) => {
  const time = new Date();
  console.log('date', time);
  return axios.post('interactions', {
    element: element,
    widget: 'Rating & Reviews',
    time: time
  })
    .then((res) => console.log(res)).catch((err) => console.log(err));
};

module.exports = { getReviews, getMeta, putHelp, postReview, putReport, postInteraction, fwdQuery };
// module.exports.getReviews = getReviews;
// module.exports.getMeta = getMeta;
// module.exports.putHelp = putHelp;
// module.exports.postReview = postReview;
// module.exports.putReport = putReport;
// module.exports.postInteraction = postInteraction;

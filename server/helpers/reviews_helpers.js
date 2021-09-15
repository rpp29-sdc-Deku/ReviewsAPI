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

  const reviewsQuery = `
    CREATE TEMPORARY TABLE reviewIds (review_id INT);

    INSERT INTO reviewIds (review_id)
      SELECT id
      FROM reviews
      WHERE product_id=${product_id}   AND id >= ${page}
      HAVING reported=false
      ORDER BY ${sortOptions[sort]}
      LIMIT ${count};
  `;

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
  return axios.get(`reviews/meta/?product_id=${product}`)
    .then(results => {
      return results.data;
    })
    .catch(err => {
      console.log(err.stack);
    });
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

module.exports.getReviews = getReviews;
module.exports.getMeta = getMeta;
module.exports.putHelp = putHelp;
module.exports.postReview = postReview;
module.exports.putReport = putReport;
module.exports.postInteraction = postInteraction;

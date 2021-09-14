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
    SELECT reviews.*
    FROM reviews
    WHERE reviews.product_id=${product_id} AND reviews.id >= ${page}
    HAVING reviews.reported=false
    SELECT *
    FROM photos
    WHERE id IN (${reviews.map(review => review.id).join(', ')})
    ORDER BY ${sortOptions[sort]}
    LIMIT ${count}
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
      .then(reviews => {
        const photosQuery = `
          SELECT *
          FROM photos
          WHERE id IN (${reviews.map(review => review.id).join(', ')})
        `;
        console.log(photosQuery);
        db(photosQuery).then(photos => {
          reviews.photos = photos;
          resolve(reviews);
        });
      })
      .catch(err => {
        reject(err.stack);
      });
  });

  // return axios.get('reviews', {
  //   params: {
  //     sort: sort,
  //     count: 100,
  //     product_id: product
  //   }
  // }).then((results) => {
  //   return results.data.results;
  // });
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

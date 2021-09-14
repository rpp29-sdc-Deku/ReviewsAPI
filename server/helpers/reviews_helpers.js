/* eslint-disable camelcase */
const axios = require('axios');
const db = require('../database/mysql.js');
// const db = mysql.connection;

const apiToken = process.env.API_TOKEN;
const apiURL = process.env.API;

axios.defaults.baseURL = apiURL;
axios.defaults.headers.common.Authorization = apiToken;

// TODO: replace all axios HTTP requests with DB queries

const getReviews = (product, sort = 'newest') => {
  console.log('GET reviews:', product, sort);
  const sortOptions = {
    helpful: 'helpfulness',
    newest: 'date',
    relevant: 'helpfulness DESC, date DESC'
  };

  const query = `
    SELECT reviews.*, photos.id, photos.url
    FROM reviews
    WHERE reviews.product_id=${product}
    CROSS JOIN photos
    WHERE photos.review_id=reviews.id
    HAVING reviews.reported=false
    ORDER BY ${sortOptions[sort]}
    LIMIT 100
  `;
  // const query = `
  //   SELECT * FROM reviews
  //   WHERE product_id=${product}
  //   HAVING reported=false
  //   ORDER BY ${sortOptions[sort]}
  //   LIMIT 100
  // `;

  return db(query, (err, results) => {
    if (err) {
      console.log(err.stack);
    } else {
      // console.log(results);
      return results;
    }
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

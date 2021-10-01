/* eslint-disable camelcase */
const axios = require('axios');
const getDB = require('../database/mongo.js');
// const db = mysql.connection;

let db, reviews, photos, characteristics, characteristicReviews;
let connected = false;

const mongoConnected = async () => {
  if (connected) return true;

  db = await getDB();
  console.log('MongoDB connected');
  reviews = await db.collection('reviews');
  console.log('reviews collection ready');
  photos = await db.collection('photos');
  console.log('photos collection ready');
  characteristics = await db.collection('characteristics');
  console.log('characteristics collection ready');
  characteristicReviews = await db.collection('characteristicReviews');
  console.log('characteristic reviews collection ready');
  connected = true;

  return true;
};

mongoConnected();

const apiToken = process.env.API_TOKEN;
const apiURL = process.env.API;

axios.defaults.baseURL = apiURL;
axios.defaults.headers.common.Authorization = apiToken;

const sortOptions = {
  helpful: { helpfulness: -1 },
  newest: { date: -1 },
  relevant: { helpfulness: -1, date: -1 }
};

// TODO: replace all axios HTTP requests with DB queries

const getReviews = async ({ product_id = 2, sort = 'newest', page = 0, count = 5 }) => {
  // console.log('GET reviews:', sort);

  const selectedReviews = await reviews.aggregate([
    { $match: { product_id: parseInt(product_id), reported: false } },
    { $limit: parseInt(count) },
    { $project: { _id: 0, review_id: 1, rating: 1, summary: 1, recommend: 1, response: 1, body: 1, date: { $toDate: '$date' }, reviewer_name: 1, helpfulness: 1 } },
    {
      $lookup: {
        from: 'photos',
        let: { review_id: '$review_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$$review_id', '$review_id'] }
            }
          },
          { $project: { _id: 0, id: 1, url: 1 } }
        ],
        as: 'photos'
      }
    },
    { $sort: sortOptions[sort] }
  ]).maxTimeMS(50).toArray();

  return selectedReviews;
  // console.log(dbResults);

  // const response = {
  //   product: product_id,
  //   page: page,
  //   count: count,
  //   results: dbResults
  // };

  // return {
  //   product: product_id,
  //   page: page,
  //   count: count,
  //   results: selectedReviews
  // };

  // return selectedReviews.map(review => {
  //   // console.log(review.photos);
  //   review.photos = review.photos.map(photo => ({ id: photo.id, url: photo.url }));
  //   return review;
  // });
  // console.log(selectedReviews);
  // return Promise.resolve(selectedReviews);
  // MySQL Stuff
  // const sortOptions = {
  //   helpful: 'helpfulness',
  //   newest: 'date',
  //   relevant: 'helpfulness DESC, date DESC'
  // };

  // const reviewsQuery = `
  //   SELECT reviews.*, photos.id, photos.url
  //   FROM reviews, photos
  //   WHERE reviews.product_id=5 AND photos.review_id = reviews.id
  // `;

  // const photoReviewQuery = `select reviews.*, photos.id as photo_id, photos.url from reviews LEFT JOIN photos ON photos.review_id = reviews.id WHERE reviews.product_id=2 AND reviews.reported=false;`

  // return new Promise((resolve, reject) => {
  //   reviews.find({ product_id: product_id })
  //     .then(results => {
  //       console.log(results);
  //       resolve(results);
  //     })
  //     .catch(err => {
  //       console.log(err.stack);
  //       reject(err.stack);
  //     });
  // });
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

const getMeta = async (productId) => {
  const charData = await characteristics.aggregate([
    { $match: { product_id: parseInt(productId) } },
    { $project: { _id: 0, id: 1, name: 1 } }
  ]).toArray();

  const reviewsMeta = await reviews.aggregate([
    { $match: { product_id: parseInt(productId) } },
    { $project: { _id: 0, rating: 1, recommend: 1, review_id: 1 } },
    {
      $lookup: {
        from: 'characteristicReviews',
        as: 'charReviews',
        let: { review_id: '$review_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$$review_id', '$review_id'] } }
          },
          { $project: { _id: 0, characteristic_id: 1, value: 1 } },
        ]
      }
    }
  ]).maxTimeMS(50).toArray();

  const charRatings = reviewsMeta.map(review => review.charReviews);

  const ratings = {};
  const recommended = { true: 0, false: 0 };

  reviewsMeta.forEach(review => {
    recommended[String(review.recommend)]++;
    const rating = review.rating;

    if (ratings[rating]) {
      ratings[rating]++;
    } else {
      ratings[rating] = 1;
    }
  });

  const charNames = {};
  charData.forEach(char => { charNames[char.id] = char.name; });
  // console.log(charNames);

  const ratingsCount = charRatings.length;
  const charRatingTotals = {};

  charRatings.forEach(review => {
    review.forEach(rating => {
      // console.log(charNames[String(rating.characteristic_id)]);
      const charName = charNames[rating.characteristic_id];
      if (charRatingTotals[charName]) {
        charRatingTotals[charName].value += rating.value;
      } else {
        charRatingTotals[charName] = { id: rating.characteristic_id, value: rating.value };
      }
    });
  });

  for (const char in charRatingTotals) {
    // console.log(charRatingTotals[char]);
    charRatingTotals[char].value /= ratingsCount;
  }

  return {
    product_id: productId,
    ratings: ratings,
    recommended: recommended,
    characteristics: charRatingTotals
  };
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

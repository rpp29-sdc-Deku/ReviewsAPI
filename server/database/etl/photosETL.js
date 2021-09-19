const etl = require('../etl.js');

const keys = ['id', 'url'];

const embedPhotos = (collection, insertCallback, exit = () => {}) => {
  // For each review id:
  // db.reviews.find({id}).toArray();
  // find all assocaited photos
  // db.photos.find({review_id}).toArray();
  // embed photo ids and urls in review
};

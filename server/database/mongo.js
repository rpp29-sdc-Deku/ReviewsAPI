const { MongoClient } = require('mongodb');
const { mongoETL } = require('./etl.js');
const validator = require('./mongoValidator.js');

const url = 'mongodb://localhost:27017';
const mongo = new MongoClient(url);
mongo.connect();

const dbName = 'test';

const main = async () => {
  const db = await mongo.db(dbName);
  console.log('Connected to MongoDB server');
  const collection = await db.collection('dekuReviews');
  mongoETL('./dataDump/testFile.csv', (review) => addReview(collection, review), () => { mongo.close(); });
};

const addReview = async (collection, review) => {
  collection.insertOne(review, (err, results) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log('Record created:', results.insertID);
    }
  });
};

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => mongo.close());

// module.exports = db;

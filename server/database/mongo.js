const { MongoClient } = require('mongodb');
const { mongoETL } = require('./etl.js');
const validator = require('./mongoValidator.js');

const url = 'mongodb://localhost:27017';
const mongo = new MongoClient(url);

const dbName = 'test';

mongo.connect();

const db = mongo.db(dbName);
console.log('Connected to MongoDB server');
const collection = db.collection('dekuReviews');
console.log(collection);

//   return db;
// };

const addReview = async (review) => {
  db.insertOne(review, (err, results) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log('Record created:', results.insertID);
    }
  });
};

mongoETL('./dataDump/testFile.csv', db.insertOne, () => { mongo.close(); });
// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => mongo.close());

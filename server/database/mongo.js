const { MongoClient } = require('mongodb');
// const { mongoETL } = require('./etl.js');
// const reviewKeys = require('./etl/reviewKeys.js');
// const path = require('path');
// const validator = require('./mongoValidator.js');

const url = 'mongodb://44.231.20.227:27017';
const mongo = new MongoClient(url, { serverSelectionTimeoutMS: 20000, minPoolSize: 8, maxPoolSize: 100, keepAlive: true });
mongo.connect((err, results) => {
  if (err) {
    console.log(err);
    return err;
  } else {
    console.log('MongoDB connected');
    return results;
  }
});

let _db;
let connected = false;
const dbName = 'dekuReviews';
// const sourceFile = path.resolve('./dataDump/reviews.csv');

// const main = async () => {
//   _db = await mongo.db(dbName);
//   console.log('Connected to MongoDB server');
//   const collection = await db.collection('reviews');

//   const addReviews = async (reviews) => {
//     return collection.insertMany(reviews);
//   };

//   // const insertResponse = await addReviews([{ test: 'test' }]);
//   // console.log(insertResponse);
//   // const dropResponse = await collection.drop();
//   // console.log('Reviews collection dropped:', dropResponse);
//   // const findResponse = await collection.find();
//   // console.log(findResponse);

//   await mongoETL(sourceFile, reviewKeys, addReviews, (records, time) => {
//     console.log(`${records} records inserted in ${time.display.total}`);
//   });
//   const read = await collection.find({ product_id: 2 }).toArray();
//   console.log(read);
//   return 'Done.';
// };

// const connectDB = async () => {
//   _db = await mongo.db('dekuReviews');
//   connected = true;
// }

const getDB = async () => {
  try {
    if (connected) {
      return _db;
    } else {
      _db = await mongo.db(dbName);
      connected = true;
      return _db;
    }
  } catch (err) {
    console.log(err.stack);
  }
};

const ready = () => {
  return connected;
};

getDB();

// main()
//   .then(console.log)
//   .catch(console.error);
// .finally(() => mongo.close());

module.exports = getDB;

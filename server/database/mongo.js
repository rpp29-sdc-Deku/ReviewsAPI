const { MongoClient } = require('mongodb');
const { mongoETL } = require('./etl.js');
const reviewKeys = require('./etl/reviewKeys.js');
const path = require('path');
const validator = require('./mongoValidator.js');

const url = 'mongodb://localhost:27017';
const mongo = new MongoClient(url);
mongo.connect();

const dbName = 'dekuReviews';
const sourceFile = path.resolve('./dataDump/reviews.csv');

const main = async () => {
  const db = await mongo.db(dbName);
  console.log('Connected to MongoDB server');
  const collection = await db.collection('reviews');

  const addReviews = async (reviews) => {
    return collection.insertMany(reviews);
  };

  // const insertResponse = await addReviews([{ test: 'test' }]);
  // console.log(insertResponse);
  // const dropResponse = await collection.drop();
  // console.log('Reviews collection dropped:', dropResponse);
  // const findResponse = await collection.find();
  // console.log(findResponse);

  await mongoETL(sourceFile, reviewKeys, addReviews, (records, time) => {
    console.log(`${records} records inserted in ${time.display.total}`);
  });
  const read = await collection.find({ product_id: 2 }).toArray();
  console.log(read);
  return 'Done.';
};

main()
  .then(console.log)
  .catch(console.error);
  // .finally(() => mongo.close());

// module.exports = db;

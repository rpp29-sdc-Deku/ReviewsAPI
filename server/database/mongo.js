const { MongoClient } = require('mongodb');
const validator = require('./mongoValidator.js');

const url = 'mongodb://localhost:27017';
const mongo = new MongoClient(url);

const dbName = 'test';

async function main () {
  await mongo.connect();
  const db = mongo.db(dbName);
  console.log('Connected to MongoDB server');
  const collection = await db.createCollection('dekuReviews');
  console.log(collection);

  return 'done.';
};

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => mongo.close());

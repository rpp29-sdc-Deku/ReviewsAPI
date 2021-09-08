const { MongoClient } = require('mongodb');
const validator = require('./mongoValidator.js');

const url = 'mongodb://localhost:27017';
const mongo = new MongoClient(url);

const dbName = 'test';

async function main () {
  await mongo.connect();
  console.log('Connected to MongoDB server');
  const db = mongo.db(dbName);
  const collection = db.createCollection('dekuReviews', { validator: validator });

  console.log(collection);

  return 'done.';
};

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => mongo.close());

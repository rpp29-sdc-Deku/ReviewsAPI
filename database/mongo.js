const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const mongo = new MongoClient(url);

const dbName = 'test';

async function main() {
  await client.connect()
  console.log('Connected to MongoDB server');
  const db = client.db(dbName);
  const connection = db.collection('documents');

  return 'done.';
}
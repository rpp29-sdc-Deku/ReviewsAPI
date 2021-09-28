// const path = require('path');
const fs = require('fs');
// const readline = require('readline');
// const db = require('./mysql.js');
const stopWatch = require('../helpers/stopWatch.js');
// const db = require('./mongo.js');

// const etlSources = {
//   reviews: './dataDump/reviews.csv',
//   characteristics: './dataDump/characteristics.csv',
//   characteristic_ratings: './dataDump/characteristic_reviews.csv',
//   photos: './dataDump/reviews_photos.csv',
//   testFile: './dataDump/testFile.csv'
// };

const mongoETL = async (sourceFile, keys, insertCallback, exit) => {
  // const rd = readline.createInterface({
  //   input: fs.createReadStream(sourceFile),
  //   // output: process.stdout,
  //   console: false
  // });
  const chunkSize = 10000000;
  let records = 0;
  const checkWatch = stopWatch();
  let partialLine = '';

  const keyCount = keys.length;
  const inserts = [];

  const keyify = (values) => {
    const obj = {};
    for (let i = 0; i < keyCount; i++) {
      obj[keys[i]] = values[i];
    }
    return obj;
  };

  const stream = fs.createReadStream(sourceFile, { highWaterMark: chunkSize });
  for await (const data of stream) {
    const lines = data.toString().split('\n');
    // console.log(lines);

    let start = 0;
    const end = lines.length - 1;
    const lastLine = lines[end];
    const lastIndex = lastLine.length - 1;
    const lastChar = lastIndex > 0 ? lastLine[lastIndex] : '';

    if (partialLine.length) {
      // partialLine is empty the first time through
      lines[0] = partialLine + lines[0];
    }
    partialLine = lastChar ? lastLine : '';

    if (records++ === 0) {
      // keys = lines[0].split(',');
      // keyCount = keys.length;
      start = 1;
    }

    for (let i = start; i < end; i++) {
      inserts.push(keyify(JSON.parse('[' + lines[i] + ']')));
    }

    insertCallback(inserts);
  }

  stream.on('close', () => {
    if (partialLine.length) {
      // Last line hasn't been recorded
      insertCallback([keyify(JSON.parse('[' + partialLine + ']'))]);
    }
    const time = checkWatch();
    // const message = time > 1000 ? time + ' seconds' : time + 'ms';
    exit(records, time);
  });
};

// const etl = (db) => {
//   for (const table in etlSources) {
//     const etlSourceFile = path.resolve(etlSources[table]);
//     getColNames(etlSourceFile, colNames => {
//       db.query('LOAD DATA LOCAL INFILE "' + etlSourceFile +
//         `" INTO TABLE ${table} ` +
//         'FIELDS TERMINATED BY "," ' +
//         'ENCLOSED BY \'"\' ' +
//         'LINES TERMINATED BY \'\n\' ' +
//         'IGNORE 1 ROWS ' +
//         `(${[colNames]});`, (err, results) => {
//         // db.query(`INSERT IGNORE INTO reviews (${columns}) VALUES (?);`, [row], (err, results, rows) => {
//         if (err) {
//           console.log(err);
//         } else {
//           const time = checkWatch();
//           console.log(results, `${table}: ${time().display.lap} (total: ${time().display.total}`);
//         }
//       });
//     });
//   }
// };
/*
LOAD DATA LOCAL INFILE "/Users/stevenharder/hackreactor/ReviewsAPI/server/database/dataDump/reviews.csv" INTO TABLE ${table} FIELDS TERMINATED BY "," ENCLOSED BY \'"\' LINES TERMINATED BY \'\n\' IGNORE 1 ROWS (review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness);
*/
// mongoETL('./dataDump/testFile.csv', console.log, () => {});

module.exports = { mongoETL };

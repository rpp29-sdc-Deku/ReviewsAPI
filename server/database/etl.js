const path = require('path');
const fs = require('fs');
const readline = require('readline');
// const db = require('./mysql.js');
const checkWatch = require('../helpers/stopWatch.js');

const etlSources = {
  reviews: './dataDump/reviews.csv',
  characteristics: './dataDump/characteristics.csv',
  characteristic_ratings: './dataDump/characteristic_reviews.csv',
  photos: './dataDump/reviews_photos.csv'
};

const mongoETL = async (sourceFile, insertCallback, exit) => {
  // const rd = readline.createInterface({
  //   input: fs.createReadStream(sourceFile),
  //   // output: process.stdout,
  //   console: false
  // });
  const chunkSize = 10000000;
  let records = 0;
  const start = Date.now();
  let partialLine = '';

  const stream = fs.createReadStream(sourceFile, { highWaterMark: chunkSize });
  for await (const data in stream) {
    const lines = data.split('\n');
    let start = 0;
    const end = lines.length - 1;
    const lastLine = lines[end];
    const lastIndex = lastLine.length - 1;
    const lastChar = lastIndex > 0 ? lastLine[lastIndex] : '';

    if (partialLine.length) {
      lines[0] = partialLine + lines[0];
    }
    partialLine = lastChar ? lastLine : '';

    if (records++ === 0) {
      insertCallback(lines[0].split(','));
      start = 1;
    }

    for (let i = start; i < end; i++) {
      insertCallback(JSON.parse('[' + lines[i] + ']'));
    }
  }

  // rd.on('line', line => {
  //   insertCallback(rows++ ? JSON.parse('[' + line + ']') : line.split(','));
  // });

  stream.on('close', () => {
    if (partialLine.length) {
      insertCallback(JSON.parse('[' + lines[i] + ']'));
    }
    const time = Date.now() - start;
    const message = time > 1000 ? time + ' seconds' : time + 'ms';
    console.log(`Duration: ${message}`);
    exit(rows);
  });
};

const etl = (db) => {
  for (const table in etlSources) {
    const etlSourceFile = path.resolve(etlSources[table]);
    getColNames(etlSourceFile, colNames => {
      db.query('LOAD DATA LOCAL INFILE "' + etlSourceFile +
        `" INTO TABLE ${table} ` +
        'FIELDS TERMINATED BY "," ' +
        'ENCLOSED BY \'"\' ' +
        'LINES TERMINATED BY \'\n\' ' +
        'IGNORE 1 ROWS ' +
        `(${[colNames]});`, (err, results) => {
        // db.query(`INSERT IGNORE INTO reviews (${columns}) VALUES (?);`, [row], (err, results, rows) => {
        if (err) {
          console.log(err);
        } else {
          const time = checkWatch();
          console.log(results, `${table}: ${time.display.lap} (total: ${time.display.total}`);
        }
      });
    });
  }
};

module.exports = { etl, getColNames };

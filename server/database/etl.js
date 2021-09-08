const fs = require('fs');
const readline = require('readline');

// const data = [];

module.exports = {
  etl: (sourceFile, insertCallback, exit) => {
    const rd = readline.createInterface({
      input: fs.createReadStream(sourceFile),
      // output: process.stdout,
      console: false
    });

    let rows = 0;
    const start = Date.now();

    rd.on('line', line => {
      insertCallback(rows++ ? JSON.parse('[' + line + ']') : line.split(','));
    });

    rd.on('close', () => {
      const time = Date.now() - start;
      const message = time > 1000 ? time + ' seconds' : time + 'ms';
      console.log(`Duration: ${message}`);
      exit(rows);
    });
  },
  getColumns: (sourceFile, callback) => {
    const rd = readline.createInterface({
      input: fs.createReadStream(sourceFile),
      console: false
    });

    // const start = Date.now();
    let lines = 0;
    let columns = '';

    rd.on('line', line => {
      if (!lines++) {
        columns = line;
        // rd.close();
      }
    });

    rd.on('close', () => {
      console.log(`${lines - 1} rows`);
      callback(columns);
    });
  }
};

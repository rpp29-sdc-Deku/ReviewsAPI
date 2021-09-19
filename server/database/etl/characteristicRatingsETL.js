const etl = include('../etl.js');

const keys = [
  'product_id',
  'ratings',
  'recommended',
  'characteristics'
];

const responseObj = {
  product_id: '',
  ratings: {},
  recommended: {
    false: '',
    true: ''
  },
  characteristics: {
  }
};

// etl()

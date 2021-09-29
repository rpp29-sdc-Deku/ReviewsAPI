import http from 'k6/http';
// import { Counter, Rate } from 'k6/metrics';

export const options = {
  scenarios: {
    // '1000vu-30s-270rps': {
    //   executor: 'constant-arrival-rate',

    //   // startTime: '0s',
    //   gracefulStop: '1s',
    //   // iterations: 30000,
    //   preAllocatedVUs: 1000,
    //   maxVUs: 1000,
    //   duration: '30s',
    //   // maxDuration: '1m',
    //   rate: 270,
    //   timeUnit: '1s'
    // },
    '1000vu-5m-1000rps': {
      executor: 'constant-arrival-rate',

      // startTime: '0s',
      gracefulStop: '1s',
      // iterations: 30000,
      preAllocatedVUs: 1000,
      maxVUs: 1000,
      duration: '30s',
      // maxDuration: '1m',
      rate: 1000,
      timeUnit: '1s'
    }
  }
};

// const errorCounter = new Counter('error_counter');
// const errorRate = new Rate('error_rate');

export default () => {
  const productId = 700 + Math.round(Math.random() * 100);

  http.get(`http://localhost:4000/atelier/reviews/meta?product_id=${productId}`);
  // errorRate.add(res.error_code);

  // const code = res.status;

  // if (code === 404 || code === 500) {
  //   errorCounter.add(1);
  // }
};

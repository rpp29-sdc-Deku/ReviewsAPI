module.exports = () => {
  const startTime = Date.now();
  let lapStart = startTime;
  const time = {
    current: startTime,
    lap: 0,
    total: 0,
    display: {
      lap: '0 ms',
      start: '0 ms'
    }
  };

  return () => {
    const currentTime = Date.now();
    time.current = currentTime;
    time.total = currentTime - startTime;
    time.lap = currentTime - lapStart;
    lapStart = currentTime;

    const display = (ms) => {
      if (ms > 3600000) {
        return `${(ms / 3600000).toFixed(2)} hours`;
      }
      if (ms > 60000) {
        return `${(ms / 60000).toFixed(2)} minutes`;
      }
      if (ms > 1000) {
        return `${(ms / 1000).toFixed(2)} seconds`;
      }
      return `${ms.toFixed(2)} ms`;
    };

    time.display.lap = display(time.lap);
    time.display.total = display(time.total);

    return time;
  };
};

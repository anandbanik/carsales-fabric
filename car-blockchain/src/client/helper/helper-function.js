/* eslint-disable no-magic-numbers */
module.exports = {
  calcCoverage: (carPrice, duration, type) => {
    let coverage = 0;

    if (duration === 6 && type === "comprehensive") {
      coverage = carPrice / 100 * 0.35;
    } else if (duration === 12 && type === "comprehensive") {
      coverage = carPrice / 100 * 0.3;
    } else if (duration === 6 && type === "collateral") {
      coverage = carPrice / 100 * 0.25;
    } else if (duration === 12 && type === "collateral") {
      coverage = carPrice / 100 * 0.2;
    } else {
      coverage = carPrice / 100 * 0.35;
    }
    return coverage;
  }
};
/* eslint-enable */

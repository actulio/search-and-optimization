import { getRandomNumber } from '../utils/utils.js';
import {
  readPoints,
  create2dMatrix,
  calcDistanceMatrix,
  getTourCost,
  twoOptSwap,
} from './common.js';

function generateTour(matrix, options) {
  const { percentBestCities } = options;
  const size = matrix.length - 1;

  // we let the first city out, because we start from it
  let remainingCities = Array.from(Array(size), (_, i) => i + 1);

  let from = 0;

  let tour = [];
  tour.push(0);

  for (let i = 0; i < size; i++) {
    let cLine = remainingCities.map((toCity) => ({ idx: toCity, cost: matrix[from][toCity] }));
    cLine.sort((a, b) => a.cost - b.cost);

    let pCities = Math.round(percentBestCities * cLine.length);
    let c2Lines = cLine.slice(0, pCities < 1 ? 1 : pCities);
    let rndCityIdx = getRandomNumber(0, c2Lines.length);
    let toCity = c2Lines[rndCityIdx];

    from = toCity.idx;
    remainingCities = remainingCities.filter((city) => city !== from);
    tour.push(from);
  }
  return tour;
}

function modifiedBounded(options) {
  const { probTweak } = options;
  return (tour) => {
    for (let i = 1; i < tour.length; i++) {
      if (probTweak >= getRandomNumber(0, 1, { isInt: false })) {
        const swapIdx = getRandomNumber(1, tour.length - 1);
        const aux = tour[i];
        tour[i] = tour[swapIdx];
        tour[swapIdx] = aux;
      }
    }
    return tour;
  };
}

function compareArrays(a, b) {
  for (let i in a) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function graspHillClimbing(matrix, candidate, tweak, options) {
  const { lengthHc } = options;
  let rQuality,
    sQuality,
    i = 0,
    hasChanged = true;
  let s = candidate;
  do {
    let r = tweak([...s]);

    rQuality = getTourCost({ matrix, candidate: r });
    i += 1;

    if (hasChanged) {
      sQuality = getTourCost({ matrix, candidate: s });
      i += 1;
    }

    if (rQuality < sQuality) {
      s = [...r];
      console.log(rQuality, sQuality);
      hasChanged = true;
    } else {
      hasChanged = false;
    }
  } while (i < lengthHc);

  return s;
}

function grasp(matrix, tweak, options) {
  const { iterations, lengthHc } = options;

  let counter = 0;
  let best = [];

  do {
    let candidate = generateTour(matrix, options);

    // Hill Climbing
    let s = candidate;

    let rQuality,
      sQuality,
      i = 0,
      hasChanged = true;
    do {
      let r = tweak([...s]);

      rQuality = getTourCost({ matrix, candidate: r });
      i += 1;

      if (hasChanged) {
        sQuality = getTourCost({ matrix, candidate: s });
        i += 1;
      }

      if (rQuality < sQuality) {
        s = [...r];
        hasChanged = true;
      } else {
        hasChanged = false;
      }
    } while (i < lengthHc);
    if (
      best.length === 0 ||
      getTourCost({ matrix, candidate: s }) < getTourCost({ matrix, candidate: best })
    ) {
      best = [...s];
      // console.log('changed best', getTourCost({ matrix, candidate: best }));
    }
    // Hill Climbing
    counter += lengthHc;
  } while (counter < iterations);
  return best;
}

// options = {iterations, lengthHc, probTweak, percentBestCities}

export { grasp, modifiedBounded };

import { readPoints, create2dMatrix, getRandomNumber } from '../utils/utils.js';

import {
  calcDistanceMatrix,
  readPoints,
  getGreedyShortestPath,
  getOptimumValue,
} from './common.js';

function getCitiesDistance() {}

function initPheromoneMatrix(matrix, cost) {
  const size = matrix.length;
  const value = cost;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === j) continue;
      matrix[i][j] = value;
      matrix[j][i] = value;
    }
  }
  return matrix.map((e) => 1);
}

function chooseCity(cities, distMatrix, pherMatrix) {
  const size = distMatrix.length - 1;
  let probabilityArray = new Array(size).fill({ probability: 0, index: 0 });

  const denominator = cities.reduce((acc, curr) => {
    return acc + (pherMatrix[from][curr] * 1) / distMatrix[from][curr];
  }, 0);
  probabilityArray = cities.map((toCity) => {
    return {
      probability: pherMatrix[from][toCity] / (distMatrix[from][toCity] * denominator),
      index: toCity,
    };
  });
  probabilityArray.sort((a, b) => a.probability - b.probability);

  let cumulativeSum = [];
  for (let i = 1; i < size; i++) {
    const value = probabilityArray[i] + probabilityArray[i - 1];
    const index = probabilityArray[i].index;
    cumulativeSum.push({ value, index });
  }

  const rndValue = getRandomNumber(0, 1, { isInt: false });
  const selectedCity = cumulativeSum.filter((e) => e.value >= rndValue).shift();
  if (selectedCity) return selectedCity;
  else return cumulativeSum[0].index;
}

function generateTour(distMatrix, pherMatrix) {
  let tour = [];
  let cost = 0;
  const size = distMatrix.length;

  // we let the first city out, because we start from it
  let remainingCities = Array.from(Array(size - 1), (_, i) => i + 1);

  let from = 0,
    to = 1;

  tour.push(0);

  for (let i = 0; i < size - 1; i++) {
    remainingCities.forEach((toCity) => {
      let aux = matrix[from][toCity];
      if (aux < distance) {
        distance = aux;
        to = toCity;
      }
    });
    remainingCities = remainingCities.filter((city) => city !== to);
    tour.push(to);
    from = to;
    cost += distance;
  }
  cost += matrix[from][0]; // the trip back to the first city
  return { tour, cost };
}

function main() {
  const points = readPoints('src/activity_7/points/berlin52.tsp');
  // const points = [
  //   { x: 1, y: 2 },
  //   { x: 2, y: 4 },
  //   { x: 3, y: 6 },
  //   { x: 4, y: 8 },
  //   { x: 5, y: 10 },
  // ];

  const size = points.length;
  let distMatrix = create2dMatrix(size);
  distMatrix = calcDistanceMatrix(distMatrix, points);

  const globalOptimum = getTourCost({
    distanceMatrix: distMatrix,
    pathToFile: 'src/optimums/tsp/berlin52.tour',
    // candidate: [1, 4, 5, 2, 3]
  });

  const { cost } = getGreedyShortestPath(distMatrix);
  let pherMatrix = create2dMatrix(size);
  pherMatrix = initPheromoneMatrix(pherMatrix, cost);
}

// main();

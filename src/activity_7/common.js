import fs from 'fs';
import { getRandomNumber, roundDecimal } from '../utils/utils.js';

const pow2 = (val) => Math.pow(val, 2);
const sqrt = (val) => Math.sqrt(val);

function euclideanDistance(p, q) {
  return sqrt(pow2(p.x - q.x) + pow2(p.y - q.y));
}

function calcDistanceMatrix(matrix, points, options = {}) {
  const size = points.length;
  const { round } = options;
  for (let i = 0; i < size; i++) {
    for (let j = i; j < size; j++) {
      if (i === j) continue;
      const distance = euclideanDistance(points[i], points[j]);
      // matrix[i][j] = roundDecimal(val, 2);
      // matrix[j][i] = roundDecimal(val, 2);
      const val = round ? roundDecimal(distance, round) : distance;
      matrix[i][j] = val;
      matrix[j][i] = val;
    }
  }
  return matrix;
}

function getTourCost({ matrix, pathToFile, candidate }) {
  let tour;
  if (pathToFile) tour = readFileAsArray(pathToFile, '\n');
  else if (candidate) tour = candidate;
  else console.log('Missing both PathToFile and Candidate params');

  let sum = 0;
  for (let i = 0; i < tour.length - 1; i++) {
    // minus 1 because our indexes start at 0
    const from = tour[i];
    const to = tour[i + 1];
    sum += matrix[from][to];
  }
  const lastIndex = tour[tour.length - 1];
  sum += matrix[lastIndex][0];
  return sum;
}

/**
 * @param  {Number[][]} matrix
 */
function getGreedyShortestPath(matrix) {
  let tour = [];
  let cost = 0;
  const size = matrix.length;

  // we let the first city out, because we start from it
  let remainingCities = Array.from(Array(size - 1), (_, i) => i + 1);

  let from = 0,
    to = 1;

  tour.push(0);

  for (let i = 0; i < size - 1; i++) {
    let distance = Infinity; // initialize with some value
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

function readPoints(path) {
  const file = fs.readFileSync(path, 'utf8');
  // const array = file.split(separator).map((e) => parseFloat(e.replace(',', '.')));
  const array = file.split('\n').map((e) => {
    const line = e.trim().split(/\s+/);
    return { n: line[0], x: line[1], y: line[2] };
  });

  return array;
}

/**
 * @param  {Number} size
 * @param  {Number} initialValue=0
 */
function create2dMatrix(size, initialValue = 0) {
  let matrix = Array(size);
  for (let i = 0; i < size; i++) {
    matrix[i] = Array(size).fill(initialValue);
  }
  return matrix;
}

/**
 * @param  {Number[]} route
 */
function twoOptSwap() {
  return (route) => {
    const size = route.length;
    const a = getRandomNumber(2, size),
      b = getRandomNumber(2, size);
    const i = Math.min(a, b);
    const k = Math.max(a, b);

    let newRoute = route
      .slice(0, i - 1)
      .concat(route.slice(i - 1, k + 1).reverse())
      .concat(route.slice(k + 1));

    // let newRoute = route.slice(0, i - 1);
    // newRoute = newRoute.concat(route.slice(i - 1, k + 1).reverse());
    // newRoute = newRoute.concat(route.slice(k + 1));

    return newRoute;
  };
}

export {
  calcDistanceMatrix,
  getTourCost,
  getGreedyShortestPath,
  readPoints,
  create2dMatrix,
  twoOptSwap,
};

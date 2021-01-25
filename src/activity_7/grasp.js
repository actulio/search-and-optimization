import { readFileAsArray, readPoints, create2dMatrix } from '../utils/utils.js';

const pow2 = (val) => Math.pow(val, 2);
const sqrt = (val) => Math.sqrt(val);

function euclideanDistance(p, q) {
  return sqrt(pow2(q.x - p.x) + pow2(q.y - p.y));
}

function getDistanceMatrix(pathToFile) {
  const points = readPoints(pathToFile);
  // const points = [
  //   { x: 1, y: 2 },
  //   { x: 2, y: 4 },
  //   { x: 3, y: 6 },
  //   { x: 4, y: 8 },
  //   { x: 5, y: 10 },
  // ];
  const size = points.length;
  let matrix = create2dMatrix(size);
  for (let i = 0; i < size; i++) {
    for (let j = i; j < size; j++) {
      if (i === j) continue;
      const val = euclideanDistance(points[i], points[j]);
      matrix[i][j] = val;
      matrix[j][i] = val;
    }
  }
  return matrix;
}

function getOptimumValue(distanceMatrix, pathToFile) {
  const tour = readFileAsArray(pathToFile, '\n');
  // const tour = [1, 4, 5, 2, 3];
  let sum = 0;
  for (let i = 0; i < tour.length - 1; i++) {
    // minus 1 because our indexes start at 0
    const from = tour[i] - 1;
    const to = tour[i + 1] - 1;
    sum += matrix[from][to];
  }
  const lastIndex = tour[tour.length - 1] - 1;
  sum += matrix[lastIndex][0];
  return sum;
}

const matrix = getDistanceMatrix('src/activity_7/points/berlin52.tsp');
const optimum = getOptimumValue(matrix, 'src/optimums/tsp/berlin52.tour');
console.log(optimum);

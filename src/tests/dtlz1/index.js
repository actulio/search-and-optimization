import { dtlz1 } from '../../benchmark/dtlz1.js';
import { dtlz2 } from '../../benchmark/dtlz2.js';
import { nsga2 } from '../../activity_5/nsga2_book.js';
import { getRandomArray, getRandomNumber, clone, writeObjToFile } from '../../utils/utils.js';

const P = [
  {
    id: 0,
    arr: [],
    fitness: [1, 2, 1],
    sparsity: 0,
    rank: null,
  },
  {
    id: 1,
    arr: [],
    fitness: [4, 5, 6],
    sparsity: 10,
    rank: null,
  },
  {
    id: 2,
    arr: [],
    fitness: [0, 2, 2],
    sparsity: 2,
    rank: null,
  },
  {
    id: 3,
    arr: [],
    fitness: [7, 1, 2],
    sparsity: 5,
    rank: null,
  },
  {
    id: 4,
    arr: [],
    fitness: [1, 7, 7],
    sparsity: 1,
    rank: null,
  },
];

// const params = { m: 100, a: 100, r: 0.1, p: 0.01 };
const params = { m: 100, a: 100, r: 0.1, p: 0.1 };
const options = {
  min: 0,
  max: 1,
  iterations: 100000,
  numberOfVariables: 12,
  numberOfObjectives: 3,
  D: 12,
};
const results = nsga2(params, options, dtlz2(options));

for (let result of results) console.log(result.fitness);

const toPrint = results.map((e) => e.arr);
writeObjToFile(toPrint, 'src/tests/dtlz1/dtlz2_2.txt');

// for (let i = 0; i < P.length; i++) {
//   let s = getRandomArray(0, 1, options.numberOfVariables, {isInt: false});
//   P[i].arr = [...s];
//   P[i].fitness = [...dtlz1(options)(P[i].arr)];
// }

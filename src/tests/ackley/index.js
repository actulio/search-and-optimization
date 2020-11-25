import { getBestCombinations } from '../../utils/functional.js';
import { ackley } from '../../benchmark/ackley.js';
import { readFileAsArray } from '../../utils/utils.js';
import { optmizedHillClimbing } from '../../activity_1/hill_climbing.js';
import { optimizedSimulatedAnnealing } from '../../activity_2/simulated_annealing.js';
import { optimizedGaWithElitism } from '../../activity_3/gaWithElitism.js';
import { tournamentSelection } from '../../activity_3/tournamentSelection.js';
import { twoPointCrossover } from '../../activity_3/twoPointCrossover.js';
import { boundedUniformConvolution } from '../../tweak/tweaks.js';
import { pso } from '../../activity_4/pso2.js';

const os4 = readFileAsArray('src/optimums/opt_ackley.txt', '\n');

const options = {
  min: -32,
  max: 32,
  D: 100,
  iterations: 50000,
  showProgress: false,
  fbias: -140,
  repeatStat: 10,
  bestsLenght: 5,
};

const ranges = [
  {
    label: 'swarmsize',
    range: () => {
      let arr = [];
      for (let i = 1; i <= 20; i++) arr.push(i);
      return arr;
    },
  },
  {
    label: 'c1',
    range: () => [2.05],
  },
  {
    label: 'c2',
    range: () => [2.05],
  },
  // {
  //   label: 'r',
  //   range: () => {
  //     let arr = [];
  //     // for (let i = 1; i <= 20; i++) arr.push(1 + i / 10);
  //     // return arr;
  //     return [1.2];
  //   },
  // },
  // {
  //   label: 'p',
  //   range: () => {
  //     let arr = [];
  //     // for (let i = 1; i <= 10; i++) arr.push(i / 100);
  //     // return arr;
  //     return [0.01];
  //   },
  // },
  // {
  //   label: 'initialT',
  //   range: () => {
  //     return [1000, 3000, 5000, 10000, 20000];
  //   },
  // },
  // {
  //   label: 'popsize',
  //   range: () => {
  //     return [8];
  //   },
  // },
  // {
  //   label: 'n',
  //   range: () => {
  //     return [2];
  //   },
  // },
];

// { r: 1.4, p: 0.01, popsize: 10, n: 4, qval: -139.19333304291044 }

const fitness = ackley;
const fn = 'pso';
const os = os4;

const callbackfn = {
  hillClimbing: (params, options) => {
    return optmizedHillClimbing(
      params,
      options,
      boundedUniformConvolution(params, options),
      fitness(os, options)
    );
  },
  simulatedAnnealing: (params, options) => {
    return optimizedSimulatedAnnealing(
      params,
      options,
      boundedUniformConvolution(params, options),
      fitness(os, options)
    );
  },
  gaWithElitism: (params, options) => {
    return optimizedGaWithElitism(
      params,
      options,
      boundedUniformConvolution(params, options),
      fitness(os, options),
      twoPointCrossover(options),
      tournamentSelection({ t: 2 })
    );
  },
  pso: (params, options) => {
    return pso(params, options, fitness(os, options));
  },
};

const bestCombinations = getBestCombinations(
  ranges,
  options,
  options.bestsLenght,
  callbackfn[fn],
  fitness(os, options)
);
console.log('Best combination of params: ', bestCombinations);

let quals = [];
const params = bestCombinations[bestCombinations.length - 1];
console.log('Best overall param: ', params);
for (let i = 0; i < options.repeatStat; i++) {
  const arr = callbackfn[fn](params, options);
  quals.push(fitness(os, options)(arr));
}
console.log('Quality of chosen params: ', quals);

const a = [
  1608.6675501527495,
  1394.0215549886686,
  1385.333651329118,
  1516.9828419498215,
  1581.7415080386488,
  1444.785858733214,
  1590.7715794719752,
  1357.5744013133976,
  1591.3325902085578,
  1526.0391388577953,
];

const rastringin = [
  [-327.51, -327.02, -326.12, -328.04, -326.95, -327.99, -327.5, -326.59, -327.11, -327.51],
  [-327.61, -326.84, -325.25, -327.43, -327.29, -326.68, -328.35, -325.94, -328.13, -326.13],
  [-328.51, -328.47, -328.62, -328.67, -327.46, -328.51, -327.47, -328.34, -328.25, -327.97],
  [-113.89, -99.715, -127.23, -166.96, -130.43, -195.51, -177.75, -132.39, -174.43, -95.645],
  [
    1608.6675501527495,
    1394.0215549886686,
    1385.333651329118,
    1516.9828419498215,
    1581.7415080386488,
    1444.785858733214,
    1590.7715794719752,
    1357.5744013133976,
    1591.3325902085578,
    1526.0391388577953,
  ],
];

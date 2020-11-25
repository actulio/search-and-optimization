import { getBestCombinations } from '../../utils/functional.js';
import { rastringin } from '../../benchmark/rastringin.js';
import { readFileAsArray } from '../../utils/utils.js';
import { optmizedHillClimbing } from '../../activity_1/hill_climbing.js';
import { optimizedSimulatedAnnealing } from '../../activity_2/simulated_annealing.js';
import { optimizedGaWithElitism } from '../../activity_3/gaWithElitism.js';
import { tournamentSelection } from '../../activity_3/tournamentSelection.js';
import { twoPointCrossover } from '../../activity_3/twoPointCrossover.js';
import { boundedUniformConvolution } from '../../tweak/tweaks.js';
import { pso } from '../../activity_4/pso.js';

const os = readFileAsArray('src/optimums/opt_rastringin.txt', '\n');

const options = {
  min: -5,
  max: 5,
  D: 100,
  iterations: 50000,
  showProgress: false,
  fbias: -330,
  repeatStat: 10,
  bestsLenght: 5,
};

const ranges = [
  {
    label: 'swarmsize',
    range: () => {
      let arr = [];
      for (let i = 1; i <= 50; i++) arr.push(i);
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

const fitness = rastringin;
const fn = 'pso';

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

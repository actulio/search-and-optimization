import { optimizedGaWithElitism } from '../gaWithElitism.js';
import { optimizedMiPlusLambda } from '../miPlusLambda.js';
import { optmizedHillClimbing } from '../../activity_1/hill_climbing.js';
import { optimizedSimulatedAnnealing } from '../../activity_2/simulated_annealing.js';
import { twoPointCrossover } from '../twoPointCrossover.js';
import { tournamentSelection } from '../tournamentSelection.js';
import { getBestCombinations } from '../../utils/functional.js';
import { sphere } from '../../benchmark/sphere.js';
import { rastringin } from '../../benchmark/rastringin.js';
import { rosenbrock } from '../../benchmark/rosenbrock.js';
import { boundedUniformConvolution } from '../../tweak/tweaks.js';
import fs from 'fs';

import { readFileAsArray } from '../../utils/utils.js';

const os1 = readFileAsArray('src/optimums/opt_sphere.txt', '\n');
const os2 = readFileAsArray('src/optimums/opt_rosenbrock.txt', '\n');
const os3 = readFileAsArray('src/optimums/opt_rastringin.txt', '\n');

const options = {
  min: -5,
  max: 5,
  D: 100,
  iterations: 50000,
  showProgress: false,
  fbias: -330,
};

const ranges = [
  {
    label: 'r',
    range: () => {
      // return [0.4];
      let arr = [];
      for (let i = 1; i <= 20; i++) arr.push(1 + i / 10);
      return arr;
    },
  },
  {
    label: 'p',
    range: () => {
      // return [0.1];
      let arr = [];
      for (let i = 1; i < 10; i++) arr.push(i / 10);
      return arr;
    },
  },
  {
    label: 'mi',
    range: () => [1, 2, 4],
  },
  {
    label: 'lambda',
    range: () => [1, 2, 4, 8],
  },
];

for (let i = 0; i < 0; i++) {
  let arr = optimizedGaWithElitism(
    { popsize: 4, n: 2 },
    // { mi: 1, lambda: 8 },
    // { r: 1.2, p: 0.1 },
    options,
    boundedUniformConvolution({ r: 2, p: 0.1 }, options),
    rastringin(os3, options),
    twoPointCrossover(options),
    tournamentSelection({ t: 2 })
  );
  console.log(rastringin(os3, options)(arr.arr), ',');
}
// console.log(arr);
// console.log('-------');

if (false) {
  const callbackWithRastringin = {
    hillClimbing: (params, options) => {
      return optmizedHillClimbing(
        params,
        options,
        boundedUniformConvolution(params, options),
        rastringin(os3, options)
      );
    },
    simulatedAnnealing: (params, options) => {
      return optimizedSimulatedAnnealing(
        params,
        options,
        boundedUniformConvolution(params, options),
        rastringin(os3, options)
      );
    },
    miPlusLambda: (params, options) => {
      return optimizedMiPlusLambda(
        params,
        options,
        boundedUniformConvolution(params, options),
        rastringin(os3, options)
      );
    },
  };
  const bestCombinations = getBestCombinations(
    ranges,
    options,
    5,
    callbackWithRastringin.miPlusLambda,
    rastringin(os3, options)
  );
  console.log('Best combination of params: ', bestCombinations);

  let quals = [];
  const params = bestCombinations[bestCombinations.length - 1];
  console.log('Best overall param: ', params);
  for (let i = 0; i < 10; i++) {
    const arr = callbackWithRastringin.miPlusLambda(params, options);
    quals.push(rastringin(os3, options)(arr));
  }
  console.log('Quality of chosen params: ', quals);
}

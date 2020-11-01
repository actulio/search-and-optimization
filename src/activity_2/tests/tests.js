import { readFileAsArray } from '../../utils/utils.js';
import { getBestCombinations } from '../../utils/functional.js';
import { sphere } from '../../benchmark/sphere.js';
import { rosenbrock } from '../../benchmark/rosenbrock.js';
import { boundedUniformConvolution, tabuTweak } from '../../tweak/tweaks.js';
import { optimizedSimulatedAnnealing } from '../simulated_annealing.js';
import { optimizedFeaturedBasedTabuSearch } from '../tabu_search.js';
import { optmizedHillClimbing } from '../../activity_1/hill_climbing.js';

const os1 = readFileAsArray('src/activity_1/tests/optimum.txt', '\n');
const os2 = readFileAsArray('src/activity_2/tests/optimum.txt', '\n');

const ranges = [
  {
    label: 'r',
    range: () => {
      let arr = [];
      for (let i = 1; i <= 10; i++) arr.push(i / 10);
      return arr;
    },
  },
  {
    label: 'p',
    range: () => {
      let arr = [];
      for (let i = 1; i < 10; i++) arr.push(i / 10);
      return arr;
    },
  },
  {
    label: 'l',
    range: () => [1, 2, 3],
  },
  {
    label: 'n',
    range: () => [1, 2, 3],
  },
  // {
  //   label: 'initialT',
  //   range: () => {
  //     let arr = [];
  //     for (let i = 1; i <= 5; i++) arr.push(i * 10000);
  //     return arr;
  //     // return [10000, 20000, 30000];
  //   },
  // },
];

const options = {
  min: -100,
  max: 100,
  D: 100,
  iterations: 50000,
  showProgress: false,
};

if (true) {
  options.fbias = -450;
  const callbackWithSphere = {
    hillClimbing: (params, options) => {
      return optmizedHillClimbing(
        options,
        boundedUniformConvolution(params, options),
        sphere(os1, options)
      );
    },
    simulatedAnnealing: (params, options) => {
      return optimizedSimulatedAnnealing(
        params,
        options,
        boundedUniformConvolution(params, options),
        sphere(os1, options)
      );
    },
    tabuSearch: (params, options) => {
      return optimizedFeaturedBasedTabuSearch(
        params,
        options,
        tabuTweak(params, options),
        sphere(os1, options)
      );
    },
  };
  const bestCombinations = getBestCombinations(
    ranges,
    options,
    5,
    callbackWithSphere.simulatedAnnealing,
    sphere(os1, options)
  );
  console.log('Best combination of params: ', bestCombinations);

  let quals = [];
  const params = bestCombinations[bestCombinations.length - 1];
  console.log('Best overall param: ', params);
  for (let i = 0; i < 10; i++) {
    const arr = callbackWithSphere.simulatedAnnealing(params, options);
    quals.push(sphere(os1, options)(arr));
  }
  console.log('Quality of chosen params: ', quals);
} else {
  /*
   */
  options.fbias = 390;
  const callbackWithRosenbrock = {
    hillClimbing: (params, options) => {
      return optmizedHillClimbing(
        options,
        boundedUniformConvolution(params, options),
        rosenbrock(os2, options)
      );
    },
    simulatedAnnealing: (params, options) => {
      return optimizedSimulatedAnnealing(
        params,
        options,
        boundedUniformConvolution(params, options),
        rosenbrock(os2, options)
      );
    },
    tabuSearch: (params, options) => {
      return optimizedFeaturedBasedTabuSearch(
        params,
        options,
        tabuTweak(params, options),
        rosenbrock(os2, options)
      );
    },
  };

  const bestCombinations = getBestCombinations(
    ranges,
    options,
    10,
    callbackWithRosenbrock.simulatedAnnealing,
    rosenbrock(os2, options)
  );
  console.log('Best combinations of parameters: ', bestCombinations);

  let quals = [];
  const params = bestCombinations[bestCombinations.length - 1];
  // const params = { r: 0.2, p: 0.5 };
  console.log('Best overall combination of parameters: ', params);
  for (let i = 0; i < 10; i++) {
    let arr = callbackWithRosenbrock.simulatedAnnealing(params, options);
    quals.push(rosenbrock(os2, options)(arr));
  }
  console.log('Quality of chosen parameters: ', quals);
}

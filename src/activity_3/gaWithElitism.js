import { getRandomArray } from '../utils/utils.js';
import '../utils/typedefs.js';

/**
 * @deprecated Use optimizedGaWithElitism instead
 */
export function gaWithElitism(params, options, mutate, fitness, crossover) {
  const { popsize, n } = params;
  const { min, max, D, iterations } = options;

  let P = [];
  let Q = [];
  let best = [];

  for (let i = 0; i < popsize; i++) {
    P.push(getRandomArray(min, max, D, { isInt: false }));
  }

  for (let i = 0; i < iterations; i++) {
    let assessedFitness = [];
    for (let Pi of P) {
      assessedFitness.push(fitness(Pi));
      if (best === undefined || fitness(Pi) < fitness(best)) {
        best = Pi;
      }
    }
    // Q ← {the n fittest individuals in P, breaking ties at random} TODO
    for (let j = 0; j < (popsize - n) / 2; j++) {
      let parentPa;
      let parentPb;
      let childrenCa = [...parentPa];
      let childrenCb = [...parentPb];
      crossover(childrenCa, childrenCb);
      Q.push(mutate(childrenCa));
      Q.push(mutate(childrenCb));
    }
    P = [...Q];
  }
  return best;
}

/**
 * @description Algorithm 33: The Genetic Algorithm with Elitism
 * @param  {Object} params object containing params
 * @param  {Number} params.popsize desired population size
 * @param  {Number} params.n desired number of elite individuals
 * @param  {Options} options object containing params
 * @param  {Function} mutate the mutation function
 * @param  {Function} fitness the fitness/quality function
 * @param  {Function} crossover the crossover function
 * @param  {Function} selectWithReplacement the selection function
 */
export function optimizedGaWithElitism(
  params,
  options,
  mutate,
  fitness,
  crossover,
  selectWithReplacement
) {
  const { popsize, n } = params;
  const { min, max, D, iterations } = options;

  if ((popsize - n) % 2 !== 0) return Array(100).fill(max);

  let P = [];
  let Q = [];
  let counter = 0;

  for (let i = 0; i < popsize; i++) {
    P.push({ arr: getRandomArray(min, max, D, { isInt: false }), fitness: null });
  }

  let best = { arr: P[0].arr, fitness: fitness(P[0].arr) };

  for (let i = 0; i < iterations; i++) {
    P.forEach((pi, idx) => {
      if (pi.fitness === null) {
        P[idx].fitness = fitness(pi.arr);
        counter += 1;
      }
      if (pi.fitness < best.fitness) {
        best = { arr: [...pi.arr], fitness: pi.fitness };
      }
    });

    Q = P.sort((a, b) => a.fitness - b.fitness).slice(0, n);

    for (let j = 0; j < (popsize - n) / 2; j++) {
      let parentPa = selectWithReplacement(P, fitness);
      let parentPb = selectWithReplacement(P, fitness);
      let { childrenCa, childrenCb } = crossover(parentPa.arr, parentPb.arr);
      Q.push({ arr: mutate([...childrenCa]), fitness: null });
      Q.push({ arr: mutate([...childrenCb]), fitness: null });
    }
    P = [...Q];
  }
  return best.arr;
}

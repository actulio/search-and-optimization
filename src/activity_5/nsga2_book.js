import { getRandomArray, getRandomNumber, clone } from '../utils/utils.js';
import { boundedUniformConvolution } from '../tweak/tweaks.js';
import { twoPointCrossover } from '../activity_3/twoPointCrossover.js';
import '../utils/typedefs.js';

/**
 * @description Algorithm 104: An Abstract Version of the Non-Dominated Sorting Genetic Algorithm II (NSGA-II)
 * @param  {Object} params object containing variable options
 * @param  {Number} params.m desired population size
 * @param  {Number} params.a desired archive size
 * @param  {Options} options object containing options
 * @param  {Function} breed
 * @param  {Function} fitness the fitness/quality function
 */
export function nsga2(params, options, fitness) {
  const { m, a } = params;
  const { min, max, iterations, numberOfVariables } = options;

  let counter = 0;
  let bestFront;
  let P = [],
    A = [],
    R = [];
  for (let i = 0; i < m; i++) {
    let s = getRandomArray(min, max, numberOfVariables, { isInt: false });
    P.push({
      id: i,
      arr: [...s],
      fitness: null,
      sparsity: null,
      rank: null,
    });
  }

  do {
    for (let i = 0; i < P.length; i++) {
      P[i].fitness = [...fitness(P[i].arr)];
      counter++;
    }
    P.concat([...A]);
    // bestFront = clone(paretoNonDominatedFront([...P]));
    // R = clone(paretoFrontRankAssignment(P));
    R = clone(paretoFrontRankAssignment(P));
    bestFront = clone(R[0]);
    A = [];
    for (let i = 0; i < R.length; i++) {
      sparsityAssignment(R[i], options);
      if (A.length + R[i].length >= a) {
        let sparsest = clone(R[i]);
        sparsest.sort((a, b) => b.sparsity - a.sparsity);
        A.push(...sparsest.slice(0, a - A.length));
        break;
      } else {
        A.push(...R[i]);
      }
    }
    P = breed(clone(A), twoPointCrossover(options), boundedUniformConvolution(params, options));
  } while (counter < iterations);

  return bestFront;
}

/**
 * @description Algorithm 98: Pareto Domination
 * @param  {Individual_NSGA2} A individual A
 * @param  {Individual_NSGA2} B individual B
 */
function paretoDomination(A, B) {
  let a = false;
  const objLen = A.fitness.length;
  for (let i = 0; i < objLen; i++) {
    // A might dominate B
    if (A.fitness[i] < B.fitness[i]) a = true;
    else if (B.fitness[i] < A.fitness[i]) return false; // A definitely does not dominate B
  }

  return a;
}

/**
 * @description Algorithm 99: Pareto Domination Binary Tournament Selection
 * @param  {Individual_NSGA2[]} P population
 */
function paretoDominationSelection(P) {
  const rndIdxA = getRandomNumber(0, P.length - 1, { isInt: true });
  const rndIdxB = getRandomNumber(0, P.length - 1, { isInt: true });

  const Pa = P[rndIdxA];
  const Pb = P[rndIdxB];

  // console.log(rndIdxA, rndIdxB);

  if (paretoDomination(Pa, Pb)) return Pa;
  else if (paretoDomination(Pb, Pa)) return Pb;
  else {
    const rnd = getRandomNumber(0, 1, { isInt: true }); // chosen at random
    if (rnd) return Pa;
    else return Pb;
  }
}

/**
 * @description Algorithm 100: Computing a Pareto Non-Dominated Front
 * @param  {Individual_NSGA2[]} G population
 */
function paretoNonDominatedFront(G) {
  let F = [];
  for (let i = 0; i < G.length; i++) {
    F.push(clone(G[i]));
    for (let j = 0; j < F.length; j++) {
      if (i === j) break;
      if (paretoDomination(F[j], G[i])) {
        F.pop();
        break;
      } else if (paretoDomination(G[i], F[j])) {
        F.splice(j, 1);
      }
    }
  }
  return F;
}

/**
 * @description Algorithm 101: Front Rank Assignment by Non-Dominated Sorting
 * @param  {Individual_NSGA2[]} P population
 */
function paretoFrontRankAssignment(P) {
  let PLine = clone(P);
  let R = [];
  let i = 0;
  do {
    R[i] = paretoNonDominatedFront(PLine);
    R[i].forEach((A) => {
      let idx = P.findIndex((e) => e.id === A.id);
      if (idx >= 0) {
        A.rank = i;
        P[idx].rank = i;
      }

      idx = PLine.findIndex((e) => e.id === A.id);
      PLine.splice(idx, 1);
      // console.log(PLine.length);
    });
    i++;
  } while (PLine.length !== 0);
  return R;
}

/**
 * @description Algorithm 102: MultiObjective Sparsity Assignment
 * @param  {Individual_NSGA2[]} F population
 * @param  {Options} options
 */
function sparsityAssignment(F, options) {
  const { min, max } = options;
  for (let i = 0; i < F.length; i++) {
    F[i].sparsity = 0;
  }

  let objLen = F[0].fitness.length;
  for (let i = 0; i < objLen; i++) {
    F.sort((a, b) => a.fitness[i] - b.fitness[i]); // pra que FLine???
    F[0].sparsity = Infinity;
    F[F.length - 1].sparsity = Infinity;
    for (let j = 1; j < F.length - 1; j++) {
      F[j].sparsity = F[j].sparsity + (F[j + 1].fitness[i] - F[j - 1].fitness[i]) / (max - min);
    }
  }
  return F;
}

/**
 * @description Algorithm 103: Non-Dominated Sorting Lexicographic Tournament Selection With Sparsity
 * @param  {Individual_NSGA2[]} P population with pareto fronts already assigned
 * @param  {number} t tournament size, with t >= 1
 */
function nonDominatedTournamentSelection(P, t) {
  t = t < 1 ? 1 : t;
  let rnd = getRandomNumber(0, P.length - 1, { isInt: true });
  let best, next;

  best = P[rnd]; // individual picked at random

  for (let i = 2; i <= t; i++) {
    rnd = getRandomNumber(0, P.length - 1, { isInt: true });
    next = P[rnd];
    if (next.rank < best.rank) {
      best = next;
    } else if (next.rank === best.rank) {
      if (next.sparsity > best.sparsity) {
        best = next;
      }
    }
  }
  return best;
}

export function breed(P, crossover, mutate) {
  let Q = [];
  let count = 0;
  for (;;) {
    let parentPa = nonDominatedTournamentSelection(P, 2);
    let parentPb = nonDominatedTournamentSelection(P, 2);
    let { childrenCa, childrenCb } = crossover(parentPa.arr, parentPb.arr);
    Q.push({
      id: count++,
      arr: mutate([...childrenCa]),
      fitness: null,
      sparsity: null,
    });
    if (count >= P.length) break;
    Q.push({
      id: count++,
      arr: mutate([...childrenCb]),
      fitness: null,
      sparsity: null,
    });
    if (count >= P.length) break;
  }
  P = [...Q];
  return P;
}

// /**
//  * @description Algorithm 100: Computing a Pareto Non-Dominated Front
//  * @param  {Individual_NSGA2[]} G population
//  */
// function nonDominatedFront(G) {
//   let F = [];
//   for (let i = 0; i < G.length; i++) {
//     let shouldAddG = false;
//     for (let j = 0; j < F.length; j++) {
//       if (i === j) break;
//       if (paretoDomination(F[j], G[i])) {
//         shouldAddG = false;
//         break;
//       } else if (paretoDomination(G[i], F[j])) {
//         shouldAddG = true;
//         F.splice(j, 1);
//       }
//     }
//     if (shouldAddG) F.push(clone(G[i]));
//   }
//   return F;
// }

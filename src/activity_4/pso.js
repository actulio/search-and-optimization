import { getRandomArray, getRandomNumber } from '../utils/utils.js';
import '../utils/typedefs.js';

/**
 * @description The Particle Swarm Optmization algorithm
 * @param  {Object} params desired swarm size
 * @param  {Number} params.swarmsize number of parents selected
 * @param  {Number} params.c1 the self-confidence
 * @param  {Number} params.c2 the swarm confidence
 * @param  {Options} options object containing options
 * @param  {Function} fitness the fitness/quality function
 */
export function pso(params, options, fitness) {
  const { swarmsize, c1, c2 } = params;
  const { min, max, D, iterations } = options;

  const fi = c1 + c2;
  const chi = 2 / (2 - fi - Math.sqrt(Math.pow(fi, 2) - 4 * fi)); // The Constriction Factor X

  let P = [];
  let counter = 0;

  for (let i = 0; i < swarmsize; i++) {
    // initialization procedure
    let pOft = getRandomArray(min, max, D, { isInt: false });
    let vOft = getRandomArray(0, 1, D, { isInt: false });
    const fitvalue = fitness(pOft);
    P.push({
      position: [...pOft],
      velocity: [...vOft],
      fitness: fitvalue,
      personalBest: {
        position: [...pOft],
        fitness: fitvalue,
      },
    });
  }

  let globalBest = {
    position: [...P[0].position],
    velocity: [...P[0].velocity],
    fitness: fitness(P[0].position),
  };

  do {
    for (let i = 0; i < swarmsize; i++) {
      P[i].fitness = fitness(P[i].position);
      counter++;

      if (P[i].fitness < P[i].personalBest.fitness) {
        P[i].personalBest.fitness = P[i].fitness;
        P[i].personalBest.position = [...P[i].position];
        // console.log(i, ': personal best update');
      }
      if (P[i].fitness < globalBest.fitness) {
        // console.log(i, ': global best update');
        globalBest = {
          position: [...P[i].position],
          velocity: [...P[i].velocity],
          fitness: P[i].fitness,
        };
      }
    }
    for (let i = 0; i < swarmsize; i++) {
      for (let idx = 0; idx < D; idx++) {
        const xid = P[i].position[idx];
        const fi1 = getRandomNumber(0, 1, { isInt: false });
        const fi2 = getRandomNumber(0, 1, { isInt: false });

        const pid = P[i].personalBest.position[idx];
        const vid = P[i].velocity[idx];
        const gid = globalBest.position[idx];

        const vidNext = chi * (vid + c1 * fi1 * (pid - xid) + c2 * fi2 * (gid - xid));
        const xidNext = xid + vidNext;

        P[i].position[idx] = xidNext;
        P[i].velocity[idx] = vidNext;
      }
    }
  } while (counter < iterations);

  return globalBest.position;
}

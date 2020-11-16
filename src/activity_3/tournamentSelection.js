import { getRandomNumber } from '../utils/utils.js';
/**
 * @description Algorithm 32: Tournament Selection
 * @param  {Object} params object containing options
 * @param  {Number} params.t tournament size, t >= 1
 */
export function tournamentSelection(params) {
  const { t } = params;
  /**
   * @param  {Number[[]]} P Population
   */
  return (P = [], fitness) => {
    let rndIdx = getRandomNumber(0, P.length - 1, { isInt: true });
    let best = P[rndIdx];
    for (let i = 2; i <= t; i++) {
      rndIdx = getRandomNumber(0, P.length - 1, { isInt: true });
      let next = P[rndIdx];
      if (fitness(next.arr) < fitness(best.arr)) {
        best = next;
      }
    }
    return best;
  };
}

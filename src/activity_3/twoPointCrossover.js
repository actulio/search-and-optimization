import { getRandomNumber } from '../utils/utils.js';
/**
 * @description Algorithm 24
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.D Number of dimensions
 */
export function twoPointCrossover(options) {
  const { D } = options;
  /**
   * @param  {Number[]} v First vector to be crossed over
   * @param  {Number[]} w Second vector to be crossed over
   */
  return (v = [], w = []) => {
    let c = getRandomNumber(1, D, { isInt: true });
    let d = getRandomNumber(1, D, { isInt: true });

    if (c > d) {
      // swap c and d
      const aux = c;
      c = d;
      d = aux;
    }
    for (let i = c; i < d - 1; i += 1) {
      // swap the values of vi and wi
      const aux = v[i];
      v[i] = w[i];
      w[i] = aux;
    }
    return { childrenCa: v, childrenCb: w };
  };
}

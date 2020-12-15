import { getRandomNumber } from '../utils/utils.js';

/**
 * @description Algorithm 8: Bounded Uniform Convolution
 * @param  {Object} params object containing parameter options
 * @param  {Number} params.r half-range of uniform noise
 * @param  {Number} params.p probability of adding noise to an element in the vector
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.min minimum desired vector element value
 * @param  {Number} options.max maximum desired vector element value
 */
export function boundedUniformConvolution(params, options) {
  const { min, max } = options;
  const { r, p } = params;
  /**
   * @param  {Number[]} v vector <v1, v2, ...v3> to be convolved
   */
  return (v) => {
    let n;
    for (let i = 0; i < v.length; i += 1) {
      if (p >= getRandomNumber(0, 1, { isInt: false })) {
        do {
          n = getRandomNumber(-r, r, { isInt: false });
        } while (v[i] + n < min || v[i] + n > max);
        v[i] += n;
      }
    }
    return v;
  };
}

/**
 * @callback
 * @param  {Object} options object containing fixed options
 * @param  {Number} options.min minimum desired vector element value
 * @param  {Number} options.max maximum desired vector element value
 * @param  {Object} params object containing tweak options
 * @param  {Number} params.r half-range of uniform noise
 * @param  {Number} params.p probability of adding noise to an element in the vector
 */
export function tabuTweak(params, options) {
  const { min, max } = options;
  const { r, p } = params;
  /**
   * @param  {Number[]} v vector <v1, v2, ...v3> to be convolved
   */
  return (v, L, c = 0) => {
    let n;
    let howManyChanges;
    while (true) {
      howManyChanges = 0;
      for (let i = 0; i < v.length; i += 1) {
        if (p >= getRandomNumber(0, 1, { isInt: false })) {
          howManyChanges += 1;
          do {
            n = getRandomNumber(-r, r, { isInt: false });
          } while (v[i] + n < min && v[i] + n > max);
          v[i] += n;
        }
      }
      const shouldStop = L.findIndex((e) => {
        return e.feature === howManyChanges;
      });
      if (shouldStop === -1 || L.length === 0) {
        break;
      }
    }
    return { arr: v, nChanged: howManyChanges };
  };
}

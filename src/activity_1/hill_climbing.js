import { getRandomArray } from '../utils/utils.js';
import '../utils/typedefs.js';

/**
 * @deprecated Use optmizedHillClimbing instead
 */
function hillClimbing(options, tweak, quality) {
  let { min, max, D, iterations } = options;

  let s = getRandomArray(min, max, D); // some initial candidate solution

  for (let i = 0; i < iterations; i += 1) {
    let r = tweak([...s]);
    if (quality(r) < quality(s)) {
      s = [...r];
    }
  }
  return s;
}

/**
 * @description Algorithm 4: Hill-Climbing
 * @param  {Object} params Not used in this algorithm
 * @param  {Options} options object containing tweak options
 * @param  {Function} tweak
 * @param  {Function} quality
 */
function optmizedHillClimbing(params, options, tweak, quality) {
  let { min, max, D, iterations } = options;

  let s = getRandomArray(min, max, D); // some initial candidate solution
  let rQuality,
    sQuality,
    i = 0,
    hasChanged = true;

  do {
    let r = tweak([...s]);
    rQuality = quality(r);
    i += 1;

    if (hasChanged) {
      sQuality = quality(s);
      i += 1;
    }

    if (rQuality < sQuality) {
      s = [...r];
      hasChanged = true;
    } else {
      hasChanged = false;
    }
  } while (i < iterations);

  return s;
}

export { hillClimbing, optmizedHillClimbing };

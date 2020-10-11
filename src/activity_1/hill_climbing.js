import { getRandomArray, getRandomNumber } from '../utils/utils.js';

/**
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.min minimum desired vector element value
 * @param  {Number} options.max maximum desired vector element value
 * @param  {Number} options.D number of dimensions of the entry vector
 * @param  {Number} options.iterations max number of iterations
 * @param  {TweakFunction} tweak
 * @param  {QualityFunction} quality
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
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.min minimum desired vector element value
 * @param  {Number} options.max maximum desired vector element value
 * @param  {Number} options.D number of dimensions of the entry vector
 * @param  {Number} options.iterations max number of iterations
 * @param  {TweakFunction} tweak
 * @param  {QualityFunction} quality
 */
function optmizedHillClimbing(options, tweak, quality) {
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

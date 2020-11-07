import { getRandomArray, getRandomNumber } from '../utils/utils.js';
import '../utils/typedefs.js';

/**
 * @deprecated Use optimizedSimulatedAnnealing instead
 */
export function simulatedAnnealing(params, options, tweak, quality, decreaseTemperature) {
  let { min, max, D, iterations } = options;
  let { initialT } = params;

  let t = initialT; // temperature, initially a high number
  let s = getRandomArray(min, max, D); // some initial candidate solution
  let best = [...s];

  for (let i = 0; i < iterations; i += 1) {
    let r = tweak([...s]);
    let p = getRandomNumber(min, max, { isInt: false });
    if (quality(r) < quality(s) || p < Math.exp((quality(s) - quality(r)) / t)) {
      s = [...r];
    }
    t = decreaseTemperature(t);
    if (quality(s) < quality(best)) {
      best = [...s];
    }
  }
  return best;
}

/**
 * @description Algorithm 13: Simulated Annealing
 * @param  {Object} params object containing variable options
 * @param  {Number} params.initialT initial value of temperature tunable parameter
 * @param  {Options} options object containing fixed options
 * @param  {Function} tweak
 * @param  {Function} quality
 * @param  {Function} decreaseTemperature
 */
export function optimizedSimulatedAnnealing(params, options, tweak, quality) {
  let { min, max, D, iterations } = options;
  let { initialT } = params;

  const decreaseTemperature = (currT, iterCount) => {
    // const steps = initialT / iterations;
    // const currT = initialT - steps * iterCount;
    // return currT < 1 ? 1 : currT;
    return currT - 1 === 0 ? NaN : currT - 1;
  };

  let t = initialT; // temperature, initially a high number
  let s = getRandomArray(min, max, D); // some initial candidate solution
  let best = [...s];

  let rQuality, sQuality, bestQuality;
  let i = 0,
    hasChanged = { s: true, best: true };

  do {
    let p = getRandomNumber(0, 1, { isInt: false });
    let r = tweak([...s]);
    rQuality = quality(r);
    i += 1;

    if (hasChanged.s) {
      sQuality = quality(s);
      i += 1;
    }
    if (hasChanged.best) {
      bestQuality = quality(best);
      i += 1;
    }

    if (rQuality < sQuality || p < Math.exp((sQuality - rQuality) / t)) {
      s = [...r];
      hasChanged.s = true;
    } else hasChanged.s = false;

    if (sQuality < bestQuality) {
      best = [...s];
      hasChanged.best = true;
    } else hasChanged.best = false;

    t = decreaseTemperature(t, i);
  } while (i < iterations);

  return best;
}

import { getRandomArray, getRandomNumber } from '../utils/utils.js';

/**
 * @param  {Object} params object containing variable options
 * @param  {Number} params.l desired queue length
 * @param  {Number} params.n number of tweaks desired to sample the gradient
 * @param  {Object} options object containing fixed options
 * @param  {Number} options.min minimum desired vector element value
 * @param  {Number} options.max maximum desired vector element value
 * @param  {Number} options.D number of dimensions of the entry vector
 * @param  {Number} options.iterations max number of iterations
 * @param  {CallableFunction} tweak
 * @param  {CallableFunction} quality
 */
export function featuredBasedTabuSearch(params, options, tweak, quality) {
  let { min, max, D, iterations } = options;
  let { l, n } = params;
  // l = desired queue length, n = number of tweaks desired to sample the gradient

  let s = getRandomArray(min, max, D); // some initial candidate solution
  let best = [...s];
  let L = []; // L will hold tuples of the form <X,d>, where X is a feature and d is a timestamp
  let c = 0;
  let counter = 0;

  let nTweaked = 0;

  do {
    c = c + 1;
    // Remove from L all tuples of the form hX, di where c − d > l
    if (L.length > l) {
      L.pop();
    }
    let { arr: r } = tweak([...s], L); // Tweak will not shift to a feature in L

    for (let i = 0; i < n - 1; i++) {
      let { w, nChanged } = tweak([...s], L);
      nTweaked = nChanged;

      if (quality(w) < quality(r)) {
        r = [...w];
      }
    }
    s = [...r];
    // each feature X modified by Tweak to produce R from S
    L.unshift({ feature: nTweaked, d: c });

    if (quality(s) < quality(best)) {
      best = [...s];
    }

    counter++;
  } while (counter < iterations);

  return best;
}

/**
 * @param  {Object} params object containing variable options
 * @param  {Number} params.l desired queue length
 * @param  {Number} params.n number of tweaks desired to sample the gradient
 * @param  {Object} options object containing fixed options
 * @param  {Number} options.min minimum desired vector element value
 * @param  {Number} options.max maximum desired vector element value
 * @param  {Number} options.D number of dimensions of the entry vector
 * @param  {Number} options.iterations max number of iterations
 * @param  {CallableFunction} tweak
 * @param  {CallableFunction} quality
 */
export function optimizedFeaturedBasedTabuSearch(params, options, tweak, quality) {
  let { min, max, D, iterations } = options;
  let { l, n } = params;

  let s = getRandomArray(min, max, D); // some initial candidate solution
  let best = [...s];
  let L = [];
  let c = 0;
  let counter = 0;

  let nTweaked = 0;

  let rQuality, bestQuality;
  let hasChanged = { r: true, best: true };

  do {
    c = c + 1;
    // remover de L
    if (L.length > l) {
      L.pop();
    }

    let { arr: r } = tweak([...s], L, counter);

    rQuality = quality(r);
    counter += 1;

    for (let i = 0; i <= n - 1; i++) {
      let { arr: w, nChanged } = tweak([...s], L, counter);
      nTweaked = nChanged;

      if (quality(w) < rQuality) {
        r = [...w];
        rQuality = quality(r);
        counter += 1;
      }
      counter += 1;
    }

    s = [...r];

    L.unshift({ feature: nTweaked, d: c });

    if (hasChanged.best) {
      bestQuality = quality(best);
      counter += 1;
    }

    if (quality(s) < bestQuality) {
      counter++;
      best = [...s];
      hasChanged.best = true;
    } else hasChanged.best = false;
  } while (counter < iterations);

  return best;
}

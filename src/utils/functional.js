// const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
// const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
function fn(a, b) {
  return [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));
}

/**
 * @param  {} a
 * @param  {} b
 * @param  {} ...c
 */
export function cartesian(a, b, ...c) {
  return b ? cartesian(fn(a, b), ...c) : a;
}

/**
 * @callback TweakFunction
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.min minimum desired vector element value
 * @param  {Number} options.max maximum desired vector element value
 * @param  {Number} options.r half-range of uniform noise
 * @param  {Number} options.p probability of adding noise to an element in the vector
 */
export function boundedUniformConvolution(options) {
  const { min, max, r, p } = options;
  /**
   * @param  {Number[]} v vector <v1, v2, ...v3> to be convolved
   */
  return (v) => {
    let n;
    for (let i = 0; i < v.length; i += 1) {
      if (p >= getRandomNumber(0, 1, { isInt: false })) {
        do {
          n = getRandomNumber(-r, r, { isInt: false });
        } while (v[i] + n < min && v[i] + n > max);
        v[i] += n;
      }
    }
    return v;
  };
}

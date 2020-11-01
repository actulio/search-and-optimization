const pow2 = (val) => Math.pow(val, 2);

/**
 * @callback QualityFunction
 * @param  {Number[]} os The shifted global optimum.
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.fbias A value to shift the image of the function
 * @param  {Number} options.D Number of dimensions
 */
export function rosenbrock(os = [], options) {
  const { fbias, D } = options;
  /**
   * @param  {Number[]} x The entry array
   * @returns {Number} The value of the function shifted up by the fbias
   */
  return (x = []) => {
    let f = 0;
    let zi, zi1;
    for (let i = 0; i < D - 1; i += 1) {
      zi = x[i] - os[i] + 1;
      zi1 = x[i + 1] - os[i + 1] + 1;
      f += 100*pow2(pow2(zi) - zi1) + pow2(zi - 1);
    }
    return f + fbias;
  };
}

/**
 * @callback QualityFunction
 * @param  {Number[]} os The shifted global optimum.
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.fbias A value to shift the image of the function
 * @param  {Number} options.D Number of dimensions
 */
export function sphere(os = [], options) {
  const { fbias, D } = options;
  /**
   * @param  {Number[]} x The entry array
   * @returns {Number} The value of the function shifted up by the fbias
   */
  return (x = []) => {
    let f = 0;
    for (let i = 0; i < D; i += 1) {
      f += Math.pow(x[i] - os[i], 2);
    }
    return f + fbias;
  };
}

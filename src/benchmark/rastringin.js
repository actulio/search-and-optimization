const pow2 = (val) => Math.pow(val, 2);
const cos = (val) => Math.cos(val);
const PI = Math.PI;

/**
 * @param  {Number[]} os The shifted global optimum.
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.fbias A value to shift the image of the function
 * @param  {Number} options.D Number of dimensions
 */
export function rastringin(os = [], options) {
  const { fbias, D } = options;
  /**
   * @param  {Number[]} x The entry array
   * @returns {Number} The value of the function shifted up by the fbias
   */
  return (x = []) => {
    let f = 0;
    let zi;
    for (let i = 0; i < D; i += 1) {
      zi = x[i] - os[i];
      f += pow2(zi) - 10 * cos(2 * PI * zi) + 10;
    }
    return f + fbias;
  };
}

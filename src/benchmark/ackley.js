const exp = (val) => Math.exp(val);
const sqrt = (val) => Math.sqrt(val);
const PI = Math.PI;

/**
 * @param  {Number[]} os The shifted global optimum.
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.fbias A value to shift the image of the function
 * @param  {Number} options.D Number of dimensions
 */
export function ackley(os = [], options) {
  const { fbias, D } = options;
  /**
   * @param  {Number[]} x The entry array
   * @returns {Number} The value of the function shifted up by the fbias
   */
  return (x = []) => {
    let zi = 0;
    let a = 0,
      b = 0;
    for (let i = 0; i < D; i += 1) {
      zi = x[i] - os[i];
      a += Math.pow(zi, 2);
      b += Math.cos(2 * PI * zi);
    }
    let f = -20 * exp(-0.2 * sqrt((1 / D) * a)) - exp((1 / D) * b) + 20 + Math.E;
    return f + fbias;
  };
}

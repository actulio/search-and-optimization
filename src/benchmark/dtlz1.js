/**
 * @param  {Object} options object containing options
 * @param  {Number} options.numberOfObjectives number of objectives
 * @param  {Number} options.numberOfVariables number of variables
 */
export function dtlz1(options) {
  const { numberOfObjectives, numberOfVariables } = options;
  /**
   * @param  {Number[]} x The entry array
   * @returns {Number} The value of the function
   */
  return (x = []) => {
    let f = new Array(numberOfObjectives);

    let k = numberOfVariables - numberOfObjectives + 1;
    let g = 0.0;
    for (let i = numberOfVariables - k; i < numberOfVariables; i++) {
      g += (x[i] - 0.5) * (x[i] - 0.5) - Math.cos(20.0 * Math.PI * (x[i] - 0.5));
    }

    g = 100 * (k + g);
    for (let i = 0; i < numberOfObjectives; i++) {
      f[i] = (1.0 + g) * 0.5;
    }

    for (let i = 0; i < numberOfObjectives; i++) {
      for (let j = 0; j < numberOfObjectives - (i + 1); j++) {
        f[i] *= x[j];
      }
      if (i != 0) {
        let aux = numberOfObjectives - (i + 1);
        f[i] *= 1 - x[aux];
      }
    }

    return f;
  };
}

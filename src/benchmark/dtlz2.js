/**
 * @param  {Object} options object containing options
 * @param  {Number} options.numberOfObjectives number of objectives
 * @param  {Number} options.numberOfVariables number of variables
 */
export function dtlz2(options) {
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
      g += (x[i] - 0.5) * (x[i] - 0.5);
    }

    for (let i = 0; i < numberOfObjectives; i++) {
      f[i] = 1.0 + g;
    }

    for (let i = 0; i < numberOfObjectives; i++) {
      for (let j = 0; j < numberOfObjectives - (i + 1); j++) {
        f[i] *= Math.cos(x[j] * 0.5 * Math.PI);
      }
      if (i != 0) {
        let aux = numberOfObjectives - (i + 1);
        f[i] *= Math.sin(x[aux] * 0.5 * Math.PI);
      }
    }

    return f;
  };
}

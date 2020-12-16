/**
 * @description Algorithm 104: An Abstract Version of the Non-Dominated Sorting Genetic Algorithm II (NSGA-II)
 * @param  {Object} params object containing variable options
 * @param  {Number} params.m desired population size
 * @param  {Number} params.a desired archive size
 * @param  {Options} options object containing options
 * @param  {Function} breed
 * @param  {Function} computeFrontRanks
 * @param  {Function} fitness the fitness/quality function
 */
export function nsga2(params, options, mutate, fitness) {
  let P = [],
    Q = [],
    F = [[]];
  let Sp = [];
  let pRank, qRank;
  let np, nq;

  P.forEach((p) => {
    np = 0;
    P.forEach((q) => {
      if (p < q) Sp.push([...q]);
      else if (q < p) np++;
    });
    if ((np = 0)) {
      pRank = 1;
      F[0].push([...p]);
    }
  });
  let i = 1;
  while (F.length !== 0) {
    Q = [];
    nq = 0; // ???
    F[i].forEach((p) => {
      Sp.forEach((q) => {
        nq--;
        if (nq === 0) {
          qRank = i + 1;
          Q.push([...q]);
        }
      });
    });
    i++;
    F[i] = [...Q];
  }
}

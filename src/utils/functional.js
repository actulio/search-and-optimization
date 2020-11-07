// const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
// const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
// https://qastack.com.br/programming/12303989/cartesian-product-of-multiple-arrays-in-javascript

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
 * @param  {} customRanges
 * @param  {} options
 * @param  {} nBests=1
 * @param  {} func
 * @param  {} quality
 */
export function getBestCombinations(
  // customRanges = [{ label: '', range: () => {} }],
  customRanges,
  options,
  nBests = 1,
  func,
  quality
) {
  console.time('timer');
  console.timeLog('timer', 'Started creating combinations…');

  let sets = customRanges.map((e) => e.range());
  const arrangements = cartesian(...sets);
  let bestParams = [];

  let maxRuns = arrangements.length;
  console.timeLog('timer', `Found ${maxRuns} combinations. Resuming...`);
  let currRun = 0;

  for (let arrangement of arrangements) {
    let params = {};
    for (let i = 0; i < arrangement.length; i++) {
      params[customRanges[i].label] = arrangement[i];
    }

    let a = func(params, options);
    let candidate = [...a];
    let qval = quality(candidate);

    currRun += 1;
    if (options.showProgress) console.log('Run ', currRun, 'of ', maxRuns);

    if (bestParams.length === 0) {
      // happens only once...
      bestParams.push({ ...params, qval });
    } else {
      if (bestParams.length === nBests) {
        if (qval < bestParams[0].qval) {
          if (options.showProgress) console.log({ ...params, qval }); //just to follow along
          bestParams[0] = { ...params, qval };
          bestParams.sort((a, b) => b.qval - a.qval);
        }
      } else {
        // happens only nBests times
        bestParams.push({ ...params, qval });
        bestParams.sort((a, b) => b.qval - a.qval);
      }
    }
  }
  console.timeEnd('timer');
  return bestParams;
}

/**
 * @param  {Object} customRanges=[{label
 * @param  {()=>{}}]} range
 * @param  {} options
 */
export function getAllCombinations(customRanges = [{ label: '', range: () => {} }]) {
  let sets = customRanges.map((e) => e.range());
  const arrangements = cartesian(...sets);
  return arrangements;
}

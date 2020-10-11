// As a reminder: the gradient is simply a
// vector where each element is the slope of ~x in that dimension, that is,
import { sphere } from "./sphere.js";
import { getRandomArray, getRandomNumber } from "../utils/utils.js";

/**
 * @callback boundedUniformConvolution
 * @param  {Number[]} v vector <v1, v2, ...v3> to be convolved
 * @param  {Object} options object containing tweak options
 * @param  {Number} options.r half-range of uniform noise
 * @param  {Number} options.min minimum desired vector element value
 * @param  {Number} options.max maximum desired vector element value
 * @param  {Number} options.p probability of adding noise to an element in the vector
 */
function boundedUniformConvolution(v, options) {
  let n;
  const { r, min, max, p } = options;
  for (let i = 0; i < v.length; i++) {
    if (p >= getRandomNumber(0, 1, { isInt: false })) {
      do {
        n = getRandomNumber(-r, r, { isInt: false });
      } while (v[i] + n < min && v[i] + n > max);
      v[i] += n;
    }
  }
  return v;
}

/**
 * @param  {Number} min
 * @param  {Number} max
 * @param  {Number} D
 * @param  {Number} iterations
 * @param  {boundedUniformConvolution | Function} tweak
 * @param  {Function} quality
 */
function hillClimbing(iterations, D, tweak, quality, options = {}) {
  const { min, max, p, r } = options;
  let s = getRandomArray(min, max, D); // some initial candidate solution

  for (let i = 0; i < iterations; i++) {
    let r = tweak([...s], options);
    if (quality(r, options) > quality(s, options)) {
      s = r;
    }
  }
  return s;
}

// /**
//  * @callback TweakFunction
//  * @param  {Array} v vector <v1, v2, ...v3> to be convolved
//  * @param  {Number} r half-range of uniform noise
//  * @param  {Number} min minimum desired vector element value
//  * @param  {Number} max maximum desired vector element value
//  * @param  {Number} [p=1] probability of adding noise to an element in the vector
//  */
// function boundedUniformConvolution(v, r, min, max, p = 1) {
//   let n;
//   for (let i = 0; i < v.length; i++) {
//     if (p >= getRandomNumber(0, 1, { isInt: false })) {
//       do {
//         n = getRandomNumber(-r, r, { isInt: false });
//       } while (v[i] + n < min && v[i] + n > max);
//       v[i] += n;
//     }
//   }
//   return v;
// }

// /**
//  * @param  {Number} min
//  * @param  {Number} max
//  * @param  {Number} D
//  * @param  {Number} iterations
//  * @param  {TweakFunction} tweak
//  * @param  {sphere} quality
//  */
// function hillClimbing(min, max, D, iterations, tweak, quality) {
//   let s = getRandomArray(min, max, D); // some initial candidate solution

//   for (let i = 0; i < iterations; i++) {
//     let r = tweak([...s]);
//     if (quality(r) > quality(s)) {
//       s = r;
//     }
//   }
//   return s;
// }

// function a(opts) {
//   const { r, D } = opts;
//   return (arr) => console.log(arr, r, D);
// }

// function b(func) {
//   func([1, 2]);
// }

// b(a({ r: 4, D: 5 }));

// HoF
// function a(opts) {
//   const { r, D } = opts;
//   return (arr) => console.log(arr, r, D);
// }

// function b(func) {
//   func([1, 2]);
// }

// b(a({ r: 4, D: 5 }));

// /**
//  * @callback QualityFunction
//  * @param {Array} x The entry array
//  * @param {Array} os The shifted global optimum.
//  * @param {Number} fbias A value to shift the image of the function
//  * @param {Number} D Number of dimensions
//  * @returns {Number} The value of the function shifted up by the fbias
//  */
// function sphere(x = [], os = [], fbias, D) {
//   if (x.length < D || os.length < D)
//     throw new Error("Array sizes can't be less than number of dimensions");

//   let f = 0;
//   for (let i = 0; i < D; i++) {
//     f += Math.pow(x[i] - os[i], 2);
//   }
//   return f + fbias;
// }

// export { sphere };

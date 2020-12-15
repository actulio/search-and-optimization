import fs from 'fs';
import v8 from 'v8';

/**
 * @param  {} obj
 */
export function clone(obj) {
  return v8.deserialize(v8.serialize(obj));
}

/**
 * @param  {Number} min
 * @param  {Number} max
 * @param  {Number} size
 * @param  {Object} type
 * @param  {Boolean} type.isInt Whether the generated random number is int or float
 * @returns {Number[]}
 */
export function getRandomArray(min, max, size, type = { isInt: true }) {
  const arr = Array.from(new Array(size), (_) => {
    return type.isInt
      ? Math.floor(Math.random() * (max - min)) + min
      : Math.random() * (max - min) + min;
  });
  return arr;
}

/**
 * @param  {Number} min
 * @param  {Number} max
 * @param  {Object} type
 * @param  {Boolean} type.isInt Whether the generated random number is int or float
 * @returns {Number}
 */
export function getRandomNumber(min, max, type = { isInt: true }) {
  return type.isInt
    ? Math.floor(Math.random() * (max - min)) + min
    : Math.random() * (max - min) + min;
}

/**
 * @param  {Number[]} actual
 * @param  {Number[]} expected
 */
export function getErrorPercentArray(actual, expected) {
  if (actual.length !== expected.length) {
    throw new Error(`Different array lengths: ${actual.length} vs ${expected.length}.`);
  }
  let error = [];
  for (let i in actual) {
    if (expected[i] === 0) error.push(100);
    else error.push(((actual[i] - expected[i]) / expected[i]) * 100);
  }
  return error.map((e) => (e > 100 ? 100 : e));
}

/**
 * @param  {string} path Path pointing to the file.
 * @param  {string} separator Separator used to differ each number
 */
export function readFileAsArray(path, separator) {
  const file = fs.readFileSync(path, 'utf8');
  const array = file.split(separator).map((e) => parseFloat(e.replace(',', '.')));
  return array;
}

/**
 * @param  {} obj
 * @param  {} path
 */
export function writeObjToFile(obj, path) {
  fs.writeFile(path, JSON.stringify(obj), (error) => {
    if (error) throw error;
    console.log('Wrote to file at ' + path);
  });
}

/**
 * @param  {} arr
 */
export function getMean(arr) {
  return arr.reduce((acc, curr) => curr + acc, 0) / arr.length;
}

/**
 * @param  {} arr
 */
export function getStdDeviation(arr) {
  const meanVal = getMean(arr);
  return Math.sqrt(arr.reduce((acc, curr) => acc + Math.pow(curr - meanVal, 2), 0));
}

/**
 * @param  {} ...arrays
 */
export function sumArrays(...arrays) {
  const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
  const result = Array.from({ length: n });
  return result.map((_, i) => arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0));
}

/**
 * @param  {} num
 * @param  {} places
 */
export function roundDecimal(num, places) {
  if (!('' + num).includes('e')) {
    // @ts-ignore
    return +(Math.round(num + 'e+' + places) + 'e-' + places);
  } else {
    let arr = ('' + num).split('e');
    let sig = '';
    if (+arr[1] + places > 0) {
      sig = '+';
    }
    // @ts-ignore
    return +(Math.round(+arr[0] + 'e' + sig + (+arr[1] + places)) + 'e-' + places);
  }
}

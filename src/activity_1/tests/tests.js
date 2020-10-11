import { optmizedHillClimbing } from '../hill_climbing.js';
import { sphere } from '../../benchmark/sphere.js';
import { boundedUniformConvolution } from '../../utils/functional.js';
import {
  readFileAsArray,
  writeObjToFile,
  meanAndStdDeviation,
  getMean,
  getStdDeviation,
} from '../../utils/utils.js';

function getBestParams() {
  let auxQual = new Array(10);
  let auxStdDev = new Array(10);
  for (let i = 0; i < auxQual.length; i++) {
    auxQual[i] = new Array(20);
    auxStdDev[i] = new Array(20);
  }
  for (let r = 1; r <= 20; r += 1) {
    for (let p = 1; p <= 10; p += 1) {
      options.r = r / 10;
      options.p = p / 10;
      console.log(options.r, options.p);
      let currentCandidates = [];
      for (let i = 0; i < 1; i += 1) {
        let arr = optmizedHillClimbing(
          options,
          boundedUniformConvolution(options),
          sphere(os, options)
        );
        const quality = sphere(os, options)(arr);
        currentCandidates.push(quality);

        // this is weird, but since it a problem of minimization...
        if (bestSolution.quality > quality) {
          bestSolution = { r: r / 10, p: p / 10, quality: quality };
        }
      }
      auxQual[p - 1][r - 1] = getMean(currentCandidates);
      // auxStdDev[p - 1][r - 1] = getStdDeviation(currentCandidates);
    }
  }
  console.log(bestSolution);

  const parameterChoosing = {
    qualities: auxQual,
    stdDeviation: auxStdDev,
  };
  // writeObjToFile(parameterChoosing, 'src/activity_1/out/parameters.json');
}

function getBestSolution() {
  const times = 10;
  let allArrs = [];
  let qualities = [];
  options.r = bestSolution.r;
  options.p = bestSolution.p;
  // repeat with the chosen parameters 10 times
  for (let i = 0; i < times; i += 1) {
    let candidate = optmizedHillClimbing(
      options,
      boundedUniformConvolution(options),
      sphere(os, options)
    );
    allArrs.push([...candidate]);
    qualities.push(sphere(os, options)(candidate));
  }

  const { meanArr } = meanAndStdDeviation(allArrs, options.D);
  // const { stdDeviationArr } = meanAndStdDeviation(allArrs, options.D);
  bestSolution = {
    ...bestSolution,
    // meanArr: meanArr,
    quality: sphere(os, options)(meanArr),
    qualities: qualities,
    stdDeviation: getStdDeviation(qualities),
  };
  writeObjToFile(bestSolution, 'src/activity_1/out/out.json');

  console.log(bestSolution);
}

const options = {
  min: -100,
  max: 100,
  D: 100,
  fbias: -450,
  r: 1,
  p: 1,
  iterations: 50000,
};

let bestSolution = {
  meanArr: [],
  r: 0.5,
  p: 0.1,
  quality: Infinity,
  stdDeviation: [],
  qualities: [],
};

const os = readFileAsArray('src/activity_1/tests/optimum.txt', '\n');

// getBestParams();
// getBestSolution();

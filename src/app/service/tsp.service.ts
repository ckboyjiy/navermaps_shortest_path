import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TspService {

  constructor() { }
  shortestPath(distanceMatrix, start = 0) {
    const START = start;
    const dp = [];
    this._makeDP(dp, distanceMatrix);
    this._setupDP(dp,  distanceMatrix);
    this._solveDP(START, dp, distanceMatrix);
    const minDistance = this._findMinDistance(START, dp, distanceMatrix);
    const minPath = this._findOptimalTour(START, dp, distanceMatrix);
    return {
      distance: minDistance,
      path: minPath // minPath.filter((v, i, arr) => i < arr.length - 1)
    };
  }
  _makeDP(dp, distanceMatrix) {
    for (let i = 0; i < distanceMatrix.length; i++) {
      dp[i] = [];
      for (let j = 0; j < (1 << distanceMatrix.length); j++) {
        dp[i][j] = -1;
      }
    }
  }
  _setupDP(dp, distanceMatrix) {
    for (let i = 1; i < distanceMatrix.length; i++) {
      dp[i][1 << 0 | 1 << i] = distanceMatrix[0][i];
    }
  }
  _solveDP(s, dp, distanceMatrix) {
    for (let r = 3; r <= distanceMatrix.length; r++) {
      for (const subset of this._combinations(0, 0 , r, distanceMatrix)) {
        if (this._notIn(s, subset))  { continue; }
        for (let next = 0; next < distanceMatrix.length; next++) {
          if (next === s || this._notIn(next, subset)) { continue; }
          const state = subset ^ ( 1 << next);
          let minDist = Infinity;
          for (let e = 0; e < distanceMatrix.length; e++) {
            if (e === s || e === next || this._notIn(e, subset)) { continue; }
            const newDistance = dp[e][state] + distanceMatrix[e][next];
            if (newDistance < minDist) {
              minDist = newDistance;
            }
            dp[next][subset] = minDist;
          }
        }
      }
    }
  }
  _notIn(i, subset) {
    return ((1 << i) & subset) === 0;
  }
  _combinations(set, at, r, distanceMatrix, subset = []) {
    if (r === 0) {
      subset.push(set);
    } else {
      for (let i = at; i < distanceMatrix.length; i++) {
        set = set | (1 << i);
        subset = this._combinations(set, i + 1, r - 1, distanceMatrix, subset);
        set = set & ~(1 << i);
      }
    }
    return subset;
  }
  _findMinDistance(s, dp, distanceMatrix) {
    const END_STATE = (1 << distanceMatrix.length) - 1;
    let minTourCost = Infinity;
    for (let e = 0; e < distanceMatrix.length; e++) {
      if (e === s) { continue; }
      const tourCost = dp[e][END_STATE] + distanceMatrix[e][s];
      if (tourCost < minTourCost) {
        minTourCost = tourCost;
      }
    }
    return minTourCost;
  }
  _findOptimalTour(s, dp, distanceMatrix) {
    let lastIndex = s;
    let state = (1 << distanceMatrix.length) - 1;
    const tour = [];
    for (let i = distanceMatrix.length - 1; i >= 1; i--) {
      let index = -1;
      for (let j = 0; j < distanceMatrix.length; j++) {
        if (j === s || this._notIn(j, state)) { continue; }
        if (index === -1) { index = j; }
        const prevDist = dp[index][state] + distanceMatrix[index][lastIndex];
        const newDist = dp[j][state] + distanceMatrix[j][lastIndex];
        if (newDist < prevDist) { index = j; }
      }
      tour[i] = index;
      state = state ^ (1 << index);
      lastIndex = index;
    }
    tour[0] = tour[distanceMatrix.length] = s;
    return tour;
  }
}

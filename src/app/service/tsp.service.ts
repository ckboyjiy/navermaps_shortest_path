import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TspService {

    constructor() { }

    /**
     * TSP 경로를 생성한다.
     * @param distanceMatrix : 각 정점에서 정점으로의 거리를 표현한 이차원 배열
     * @param {number} start : 출발 정점
     * @returns {{distance: number; path: any[]}}
     */
    shortestPath(distanceMatrix, start = 0) {
        const START = start;
        const dp = [];
        this._makeDP(dp, distanceMatrix);
        this._setupDP(START, dp, distanceMatrix);
        this._solveDP(START, dp, distanceMatrix);
        const minDistance = this._findMinDistance(START, dp, distanceMatrix);
        const minPath = this._findOptimalTour(START, dp, distanceMatrix);
        return {
            distance: minDistance,
            path: minPath
        };
    }

    /**
     * 각 방문경로(y)에서 정점(x)로 오는 최단거리를 의마하는 이차원 배열 생성
     * y : 비트마스크 형태로 저장
     * x : 정점의 인덱스
     * @param dp : 메모이제이션용 이차원 배열
     * @param distanceMatrix : 각 정점에서 정점으로의 거리를 표현한 이차원 배열
     * @private
     */
    _makeDP(dp, distanceMatrix) {
        for (let i = 0; i < distanceMatrix.length; i++) {
            dp[i] = [];
            for (let j = 0; j < (1 << distanceMatrix.length); j++) {
                dp[i][j] = Infinity; // -1;
            }
        }
    }

    /**
     * 메모이제이션을 위한 dp 테이블을 초기화한다.
     * 지정된 노드(S)에서 모든 다른 노드(i)로의 최단 길이를 저장한다.
     * @param dp : 메모이제이션용 이차원 배열
     * @param distanceMatrix : 각 정점에서 정점으로의 거리를 표현한 이차원 배열
     * @private
     */
    _setupDP(START, dp, distanceMatrix) {
        for (let i = 1; i < distanceMatrix.length; i++) {
          if (i === START) { continue; }
          dp[i][1 << START | 1 << i] = distanceMatrix[START][i];
        }
    }

    /**
     * dp에 모든 방문경로(subset)에서 지정된 정점(next)으로의 최단 거리를 기록한다.
     * @param START : 시작노드
     * @param dp : 메모이제이션용 이차원 배열
     * @param distanceMatrix : 각 정점에서 정점으로의 거리를 표현한 이차원 배열
     * @private
     */
    _solveDP(START, dp, distanceMatrix) {
        for (let r = 3; r <= distanceMatrix.length; r++) {
          // r 개부터 정점의 개수만큼 조합배열을 생성하여 반복한다.
            for (const subset of this._combinations(0, 0 , r, distanceMatrix.length)) {
                if (this._notIn(START, subset))  { continue; } // 방문경로(subset)에 시작정점이 포함하지 않으면 무시한다.
                // 모든 정점에 대해 반복한다.
                for (let next = 0; next < distanceMatrix.length; next++) {
                    if (next === START || this._notIn(next, subset)) { continue; } // 시작 정점이거나 방문경로(subset)에 포함되지 않는 정점은 무시한다.
                    const state = subset ^ ( 1 << next); // 방문경로(subset)에 현재정점(next)을 제외한 새로운 값(state)으로 저장한다.
                    let minDist = Infinity;
                    // 모든 정점에 대해 반복한다.
                    for (let e = 0; e < distanceMatrix.length; e++) {
                        if (e === START || e === next || this._notIn(e, subset)) { continue; }
                        const newDistance = dp[e][state] + distanceMatrix[e][next]; // state에서 e까지 경로 + e에서 next까지의 경로
                        if (newDistance < minDist) {
                            minDist = newDistance;
                        }
                        dp[next][subset] = minDist;
                    }
                }
            }
        }
    }

    /**
     * 정점(i)가 방문목록(subset)에 포함하지 않으면 true를 반환
     * @param i
     * @param subset
     * @returns {boolean}
     * @private
     */
    _notIn(i, subset) {
      /*
      피연산자를 모두 비트로 바꿨을 때 각 비트에 대응하는 비트값이 1이면 1, 아니면 0을 반환
      즉, i의 비트마스크가 subset의 비트마스크의 동등한 자리의 비트가 둘다 1이면 1을 반환
      둘다 포함하지 않은 경우 true를 반환
       */
      return ((1 << i) & subset) === 0;
    }

    /**
     * N개의 항목 중 r개 하위의 모든 조합의 비트마스크를 생성한다.
     * @param set
     * @param at
     * @param r
     * @param N
     * @param {any[]} subset
     * @returns {any[]}
     * @private
     */
    _combinations(set, at, r, N, subset = []) {
        if (r === 0) {
            subset.push(set);
        } else {
            for (let i = at; i < N; i++) {
                set = set | (1 << i);
                subset = this._combinations(set, i + 1, r - 1, N, subset);
                set = set & ~(1 << i);
            }
        }
        return subset;
    }

    /**
     * 최단거리 구하기
     * @param s : 시작 정점
     * @param dp : 메모이제이션용 이차원 배열
     * @param distanceMatrix : 각 정점에서 정점으로의 거리를 표현한 이차원 배열
     * @returns {number}
     * @private
     */
    _findMinDistance(s, dp, distanceMatrix) {
        const END_STATE = (1 << distanceMatrix.length) - 1; // 모든 정점을 지나온 비트마스크
        let minTourCost = Infinity;
        // e는 되돌아오기 직전의 정점을 뜻함. 모든 정점을 대상으로 반복
        for (let e = 0; e < distanceMatrix.length; e++) {
            if (e === s) { continue; } // 시작 정점과 동일하면 무시
            /*
            모든 정점을 순회하고 마지막 e로 도착한 경로 + 시작s에서 e까지의 거리
            dp => S->A->B->C->E
            dm => E->S
            dp + dm => S->A->B->C->E->S
             */
            const tourCost = dp[e][END_STATE] + distanceMatrix[e][s];
            if (tourCost < minTourCost) {
                minTourCost = tourCost;
            }
        }
        return minTourCost;
    }

    /**
     * 최단 경로 구하기
     * @param START : 시작 정점
     * @param dp : 메모이제이션용 이차원 배열
     * @param distanceMatrix : 각 정점에서 정점으로의 거리를 표현한 이차원 배열
     * @returns {any[]}
     * @private
     */
    _findOptimalTour(START, dp, distanceMatrix) {
        let lastIndex = START; // 마지막 정점
        let state = (1 << distanceMatrix.length) - 1; // 모든 정점을 지나온 비트마스크
        const tour = [];
        // 마지막 도착 정점부터 하나씩 구한다.
        for (let i = distanceMatrix.length - 1; i >= 1; i--) {
            let index = -1;
            // 마지막 도착 정점의 출발 정점 찾기
            for (let j = 0; j < distanceMatrix.length; j++) {
                if (j === START || this._notIn(j, state)) { continue; } // 시작정점과 같거나, 방문정점에 포함하지 않으면 무시
                if (index === -1) { index = j; }
                const prevDist = dp[index][state] + distanceMatrix[index][lastIndex];
                const newDist = dp[j][state] + distanceMatrix[j][lastIndex];
                if (newDist < prevDist) { index = j; }
            }
            tour[i] = index;
            state = state ^ (1 << index);
            lastIndex = index;
        }
        tour[0] = tour[distanceMatrix.length] = START;
        return tour;
    }
}

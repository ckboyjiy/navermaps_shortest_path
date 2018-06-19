import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Observer} from 'rxjs';

/**
 * 컴포넌트간의 네이버맵스관련 이벤트를 주고 받기 위한 서비스
 */
@Injectable({
  providedIn: 'root'
})
export class NavermapsService {
  private readonly _observable: Observable<NavermapsEvent>;
  private _subject: BehaviorSubject<NavermapsEvent>;
  private _pinnedList: NaverPlace[] = [];
  private _zoom: number;
  private _watchLocation;
  get observable(): Observable<NavermapsEvent> {
    return this._observable;
  }
  constructor() {
    this._subject = new BehaviorSubject<NavermapsEvent>({type: 'init'});
    this._observable = new Observable<NavermapsEvent>(subscriber => {
      subscriber.next({
        type: 'marker',
        event: 'init',
        data: this._pinnedList
      });
      this._subject.subscribe(value => subscriber.next(value), error => subscriber.error(error), () => subscriber.complete());
      return {unsubscribe() {console.log('unsubscribe'); } };
    });
  }
  initMaps(zoom) {
    this._subject.next({
      type: 'map',
      event: 'created'
    });
    this.changedZoom(zoom);
  }
  changedZoom(zoom) {
    this._zoom = zoom;
    this._subject.next({
      type: 'map',
      event: 'zoom',
      data: this._zoom
    });
  }
  drawMarker(place: NaverPlace) {
    this._subject.next({
      type: 'marker',
      event: 'draw',
      data: place
    });
  }

  /**
   * 고정된 장소 추가
   * @param {NaverPlace} place
   */
  addPinnedMarker(place: NaverPlace) {
    if (this._pinnedList.findIndex(p => p === place) === -1) {
      // 새로운 장소인 경우
      this._pinnedList.push(place); // 고정리스트에 추가
      this._subject.next({ // 맵에 마커를 그리도록 이벤트 전송
        type: 'marker',
        event: 'add',
        data: place
      });
    } else {
      // 이미 추가된 장소인 경우, 단순히 그 마커의 위치로 이동시킴
      this._subject.next({
        type: 'map',
        event: 'move',
        data: place.mapInfo.point
      });
    }
  }
  removeMarker(point: naver.maps.PointObjectLiteral) {
    const index = this._pinnedList.findIndex(place => {
      const placePoint = place.mapInfo.point;
      return placePoint && point && placePoint.x === point['x'] && placePoint.y === point['y'] ? true : false;
    });
    if (index > -1) {
      this._pinnedList.splice(index, 1);
    }
    this._subject.next({
      type: 'marker',
      event: 'remove',
      data: point
    });
  }
  getGeoLocation() {
    const watchId = navigator.geolocation.watchPosition( succ => {
      navigator.geolocation.clearWatch(watchId);
      const x = succ.coords.longitude;
      const y = succ.coords.latitude;
      this._subject.next({
        type: 'map',
        event: 'geolocation',
        data: {x : x, y: y}
      });
    }, err => {
      // subscriber.error(err);
    });
  }
  watchGeoLocation() {
    console.log('start watch');
    this._watchLocation = navigator.geolocation.watchPosition( succ => {
      const x = succ.coords.longitude;
      const y = succ.coords.latitude;
      this._subject.next({
        type: 'map',
        event: 'geolocation',
        data: {x : x, y: y}
      });
    }, err => {
      // subscriber.error(err);
    });
  }
  stopWatch() {
    console.log('stop watch');
    navigator.geolocation.clearWatch(this._watchLocation);
  }
  getShortestPath() {
    this._subject.next({
      type: 'polyline',
      event: 'add',
      data: null
    });
  }
}

export interface NavermapsEvent {
  type: 'init' | 'map' | 'marker' | 'infoWindow' | 'polyline';
  event?: string;
  data?: any;
}

export interface NaverPlace {
  title: string;
  category?: string;
  description?: string;
  link?: string;
  telephone?: string;
  readAddress?: string;
  mapInfo: {
    address: string;
    point: naver.maps.PointObjectLiteral;
    addrdetail: {
      country: string;
      dongmyun: string;
      rest: string;
      ri: string;
      sido: string;
      sigugun: string;
    }
  };
}

import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Observer} from 'rxjs';
import {MarkerType, OverlayFactoryService} from './overlay-factory.service';

/**
 * 컴포넌트간의 네이버맵스관련 이벤트를 주고 받기 위한 서비스
 */
@Injectable({
  providedIn: 'root'
})
export class NavermapsService {
  private readonly _observable: Observable<NavermapsEvent>;
  private _subject: BehaviorSubject<NavermapsEvent>;
  private _depart: naver.maps.Marker;
  private _travelList: naver.maps.Marker[] = [];
  private _zoom: number;
  private _watchLocation;
  get observable(): Observable<NavermapsEvent> {
    return this._observable;
  }
  constructor(private overlayFactory: OverlayFactoryService) {
    this._subject = new BehaviorSubject<NavermapsEvent>({type: 'init'});
    this._observable = new Observable<NavermapsEvent>(subscriber => {
      subscriber.next({
        type: 'marker',
        event: 'init',
        data: this._travelList
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
    if (this._isDrewPlace(place) === false) {
      this._subject.next({
        type: 'marker',
        event: 'draw',
        data: place
      });
    }
  }

  /**
   * 출발지나 여행지에 이미 추가된 장소인지 확인한다.
   * @param {NaverPlace} place
   * @returns {boolean}
   * @private
   */
  _isDrewPlace(place: NaverPlace) {
    let result = false;
    if (this._depart && this._depart['place'] === place) { result = true; }
    if (this._travelList.findIndex(m => m['place'] === place) > -1) { result = true; }
    return result;
  }
  makeDepartMarker(place: NaverPlace) {
    const newDepart = this.overlayFactory.createMarker(MarkerType.DEPART, place);
    this._subject.next({
      type: 'marker',
      event: 'setDepart',
      data: newDepart
    });
    this._depart = newDepart;
  }

  /**
   * 여행지 추가
   * @param {NaverPlace} place
   */
  addTravelMarker(place: NaverPlace) {
    if (this._travelList.findIndex(m => m['place'] === place) === -1) {
      // 새로운 장소인 경우
      const newMarker = this.overlayFactory.createMarker(MarkerType.TRAVEL, place);
      this._travelList.push(newMarker); // 고정리스트에 추가
      this._subject.next({ // 맵에 마커를 그리도록 이벤트 전송
        type: 'marker',
        event: 'addTravel',
        data: newMarker
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
  removeMarker(marker: naver.maps.Marker) {
    const index = this._travelList.findIndex(m => m === marker);
    if (index > -1) {
      this._travelList.splice(index, 1);
    }
    this._subject.next({
      type: 'marker',
      event: 'remove',
      data: marker
    });
  }
  watchGeoLocation() {
    console.log('start watch');
    let isFirst = true;
    this._watchLocation = navigator.geolocation.watchPosition( succ => {
      const x = succ.coords.longitude;
      const y = succ.coords.latitude;
      this._subject.next({
        type: 'map',
        event: 'geolocation',
        data: {x : x, y: y, isFirst: isFirst}
      });
      isFirst = false;
    }, err => {
      // subscriber.error(err);
    });
  }
  stopWatch() {
    console.log('stop watch');
    navigator.geolocation.clearWatch(this._watchLocation);
    this._subject.next({
      type: 'map',
      event: 'geolocation',
      data: null
    });
  }
  getShortestPath() {
    this._subject.next({
      type: 'polyline',
      event: 'add',
      data: [this._depart].concat(this._travelList)
    });
  }
  resultShortestPath(path) {
    this._subject.next({
      type: 'polyline',
      event: 'shortestPath',
      data: path
    });
  }
  moveTo(marker: naver.maps.Marker) {
    this._subject.next({
      type: 'map',
      event: 'move',
      data: marker['place'].mapInfo.point
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

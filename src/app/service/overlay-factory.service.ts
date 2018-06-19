import { Injectable } from '@angular/core';
import {NaverPlace} from './navermaps.service';

@Injectable({
  providedIn: 'root'
})
export class OverlayFactoryService {

  departIcon = {
    url: '/assets/home.png',
    size: new naver.maps.Size(22, 34),
    scaledSize: new naver.maps.Size(22, 34),
    origin: new naver.maps.Point(0, 0),
    anchor: new naver.maps.Point(11, 34)
  };
  travelIcon = {
    url: '/assets/pinned.png',
    size: new naver.maps.Size(40, 40),
    scaledSize: new naver.maps.Size(40, 40),
    origin: new naver.maps.Point(0, 0),
    anchor: new naver.maps.Point(11, 38)
  };
  geoIcon = {
    url: '/assets/crosshair.png',
    size: new naver.maps.Size(20, 20),
    scaledSize: new naver.maps.Size(20, 20),
    origin: new naver.maps.Point(0, 0),
    anchor: new naver.maps.Point(10, 10)
  };
  constructor() { }
  createMarker(type: MarkerType, place?: NaverPlace): naver.maps.Marker {
    const newMarker = new naver.maps.Marker({});
    newMarker['type'] = type;
    if (type === MarkerType.DEPART) {
      newMarker.setIcon(this.departIcon);
    }
    if (type === MarkerType.TRAVEL) {
      newMarker.setIcon(this.travelIcon);
    }
    if (type === MarkerType.GEO) {
      newMarker.setIcon(this.geoIcon);
    }
    if (place) {
      newMarker['place'] = place;
      newMarker.setPosition(place.mapInfo.point);
    }
    return newMarker;
  }
}

export enum MarkerType {
  INSTANCE,
  DEPART,
  TRAVEL,
  GEO
}

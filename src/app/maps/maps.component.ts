import {
  Component,
  ComponentFactoryResolver,
  ElementRef, EventEmitter, Input,
  OnInit, Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {NavermapsEvent, NavermapsService, NaverPlace} from '../service/navermaps.service';
import {InfoWindowComponent} from '../info-window/info-window.component';
import {TspService} from '../service/tsp.service';
import {GeocoderService} from '../service/geocoder.service';
import {MarkerType, OverlayFactoryService} from '../service/overlay-factory.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  animations: [
    trigger('isShrink', [
      state('true', style({
        marginLeft: '250px'
      })),
      state('false', style({
        marginLeft: '0px'
      })),
      transition('* => true', animate('500ms ease-in')),
      transition('* => false', animate('500ms ease-in'))
    ])
  ]
})
export class MapsComponent implements OnInit {
  @Input() isShrink: boolean;
  @Output() openNav = new EventEmitter();
  /** View Child **/
  @ViewChild('maps') mapsDiv: ElementRef;
  /** member **/
  maps;
  infoWindow;
  infoWindowComponent;
  instanceMarker: naver.maps.Marker;
  geoMarker: naver.maps.Marker;
  departMarker: naver.maps.Marker;
  shortestPath;
  constructor(
      private naverService: NavermapsService, private viewContainerRef: ViewContainerRef, private geocoder: GeocoderService,
      private componentFactoryResolver: ComponentFactoryResolver, private tsp: TspService, private overlayFactory: OverlayFactoryService) {
    this.initInfoWindow();
  }
  eventSubscribe() {
    this.naverService.observable.subscribe((event: NavermapsEvent) => {
      if (event.type === 'map' && event.event === 'move')         { this.moveCenter(event.data); }
      if (event.type === 'map' && event.event === 'geolocation')  { this.setGeolocation(event.data); }
      if (event.type === 'map' && event.event === 'zoom')         { this.maps.setZoom(event.data); }
      if (event.type === 'marker' && event.event === 'draw')      { this.setInstanceMarker(event.data); }
      if (event.type === 'marker' && event.event === 'addTravel') { this.addTravelMarker(event.data); }
      if (event.type === 'marker' && event.event === 'remove')    { this.removeMarker(event.data); }
      if (event.type === 'marker' && event.event === 'setDepart') { this.setDepart(event.data); }
      if (event.type === 'polyline' && event.event === 'add')     { this.drawPolyLine(event.data); }
    });
  }

  ngOnInit() {
    this.initMap();
    this.initInstanceMarker();
    this.eventSubscribe();
  }
  resize(event) {
    const width = window.getComputedStyle(this.mapsDiv.nativeElement, null).getPropertyValue('width');
    const height = window.getComputedStyle(this.mapsDiv.nativeElement, null).getPropertyValue('height');
    this.maps.setSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    });
  }

  /**
   * 네이버 맵을 초기화하고 이벤트를 발생한다.
   */
  initMap() {
    this.maps = new naver.maps.Map(this.mapsDiv.nativeElement);
    naver.maps.Event.addListener(this.maps, 'click', (event) => {
      this.clickMap(event.coord);
    });
    naver.maps.Event.addListener(this.maps, 'zoom_changed', (event) => {
      this.naverService.changedZoom(event);
    });
    this.naverService.initMaps(this.maps.getZoom());
  }
  setDepart(marker: naver.maps.Marker) {
    this.closeInfo();
    this.removeMarker(this.instanceMarker);
    if (this.departMarker) {
      this.removeMarker(this.departMarker);
    }
    marker.setMap(this.maps);
    this._addMarkerEvent(marker);
    this.openInfo(marker);
    this.departMarker = marker;
  }
  drawGeoMarker(data) {
    if (this.geoMarker === undefined) {
      this.geoMarker = new naver.maps.Marker({
        map: this.maps,
        position: data,
        icon: {
          url: '/assets/crosshair.png',
          size: new naver.maps.Size(20, 20),
          scaledSize: new naver.maps.Size(20, 20),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(10, 10)
        }
      });
    } else {
      if (this.geoMarker.getMap() === null) {
        this.geoMarker.setMap(this.maps);
      }
      this.geoMarker.setPosition(data);
    }
  }
  removeGeoMarker() {
    this.geoMarker.setMap(null);
  }
  setGeolocation(data) {
    console.log(data);
    if (data) {
      if (data.isFirst) {
        this.maps.setCenter(data);
      }
      this.drawGeoMarker(data);
    } else {
      this.removeGeoMarker();
    }
  }
  clickMap(coord: naver.maps.Coord) {
    this.geocoder.searchCoord(coord).subscribe((v: NaverPlace) => this.setInstanceMarker(v));
  }

  /**
   * 인스턴스 마커 및 인스턴스 마커의 이벤트를 초기화한다.
   */
  initInstanceMarker() {
    this.instanceMarker = this.overlayFactory.createMarker(MarkerType.INSTANCE);
    this._addMarkerEvent(this.instanceMarker);
  }
  moveCenter(point: naver.maps.PointObjectLiteral) {
    console.log(this.maps.getSize());
    this.maps.panTo(point, {});
  }

  /**
   * 지정된 장소에 인스턴스 마커를 위치시킨다.
   * @param {NaverPlace} place
   */
  setInstanceMarker(place: NaverPlace) {
    const point = place.mapInfo.point;
    this.instanceMarker.setMap(this.maps);
    this.instanceMarker.setPosition(point);
    this.instanceMarker['place'] = place;
    if (this.infoWindow.getMap()) { // 맵이 열려 있으면 먼저 닫는다.
      this.closeInfo();
    }
    this.openInfo(this.instanceMarker);
      this.moveCenter(place.mapInfo.point);
  }

  /**
   * 여행지 마커에 추가한다.
   * @param {NaverPlace} place
   */
  addTravelMarker(marker: naver.maps.Marker) {
    this.removeMarker(this.instanceMarker);
    marker.setMap(this.maps);
    this._addMarkerEvent(marker);
    this.openInfo(marker);
  }
  removeMarker(marker: naver.maps.Marker) {
    this.closeInfo(); // 정보창이 열려 있다면 닫는다.
    if (this.shortestPath) {
      this.shortestPath.setMap(null);
      this.shortestPath = null;
    }
    marker.setMap(null);
    if (marker['type'] === 'TRAVEL') {
      naver.maps.Event.clearInstanceListeners(marker);
    }
    if (marker['type'] === 'DEPART') {
      naver.maps.Event.clearInstanceListeners(marker);
    }
  }

  /**
   * 정보창을 초기화한다.
   */
  initInfoWindow() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(InfoWindowComponent);
    this.infoWindowComponent = this.viewContainerRef.createComponent(factory);
    this.infoWindow = new naver.maps.InfoWindow({
      content: this.infoWindowComponent.location.nativeElement,
      borderColor: '#AAAAAA'
    });
  }

  /**
   * 해당 마커 위에 장소 정보를 세팅하여 정보창을 연다.
   * @param marker : 정보창을 표시할 마커의 위치
   * @param {NaverPlace} place : 정보창의 내용
   */
  openInfo(marker: naver.maps.Marker) {
    if (this.infoWindow.getMap()) { // 맵이 열려 있으면 먼저 닫는다.
      this.closeInfo();
      // 정보창의 마커와 같지않다면 정보창을 연다.
      if (!this.infoWindowComponent.instance.isEqualMarker(marker)) {
        this.infoWindowComponent.instance.marker = marker;
        this.infoWindow.open(this.maps, marker);
      }
    } else {
      this.infoWindowComponent.instance.marker = marker;
      this.infoWindow.open(this.maps, marker);
    }
  }
  closeInfo() {
    this.infoWindow.close();
  }
  drawPolyLine(markers: naver.maps.Marker[]) {
    this.closeInfo();
    /** 1. 마커들 간의 간선 거리를 표현한 이차원 배열 준비 */
    const perm = this._makeEdges(markers);

    /** 2. TSP를 이용하여 최단경로를 계산한다. */
    const minPath = this.tsp.shortestPath(perm);
    this._drawEdges(markers, minPath);
    this.naverService.resultShortestPath(minPath);
  }
  _makeEdges(markers: naver.maps.Marker[]) {
    return markers.map((marker1: naver.maps.Marker, i) => {
      return markers.map((marker2: naver.maps.Marker, j) => {
        const polyline = new naver.maps.Polyline({ // 2. 간선에 대한 거리를 계산한다.
          map: this.maps,
          visible: false,
          path: [marker1.getPosition(), marker2.getPosition()]
        });
        const distance = polyline.getDistance();
        polyline.setMap(null);
        return distance;
      });
    });
  }
  _drawEdges(markers: naver.maps.Marker[], shortest) {
    if (!this.shortestPath) {
      this.shortestPath = new naver.maps.Polyline({ // 2. 간선에 대한 거리를 계산한다.
        map: this.maps,
        startIcon: naver.maps.PointingIcon.CIRCLE,
        endIcon: naver.maps.PointingIcon.OPEN_ARROW,
        strokeLineJoin: 'round ',
        path: shortest.path.map(v => markers[v].getPosition())
      });
    } else {
      this.shortestPath.setPath(shortest.path.map(v => markers[v].getPosition()));
    }
    this.maps.fitBounds(markers.map((marker: naver.maps.Marker) => {
        return {x: marker['position'].x, y: marker['position'].y};
    }));
    // this.openNav.emit(true);
  }

  /**
   * 마커에 정보창 이벤트를 연결한다.
   * @param marker
   * @private
   */
  _addMarkerEvent(marker) {
    naver.maps.Event.addListener(marker, 'click', (event) => {
      this.openInfo(marker);
    });
  }
}

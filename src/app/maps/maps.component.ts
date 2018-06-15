import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {NavermapsEvent, NavermapsService, NaverPlace} from '../service/navermaps.service';
import {InfoWindowComponent} from '../info-window/info-window.component';
import {TspService} from '../service/tsp.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  /** View Child **/
  @ViewChild('maps') mapsDiv: ElementRef;
  /** member **/
  maps;
  infoWindow;
  infoWindowComponent;
  instanceMarker;
  instancePlace;
  markers;
  shortestPath;
  constructor(private naverService: NavermapsService, private viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private tsp: TspService) {
    this.markers = [];
    this.initInfoWindow();
      this.naverService.observable.subscribe((event: NavermapsEvent) => {
      switch (event.type) {
        case 'map':
          switch (event.event) {
            case 'move':
              this.moveCenter(event.data);
              break;
            case 'geolocation':
              this.maps.setCenter(event.data);
              break;
          }
          break;
        case 'marker':
          switch (event.event) {
            case 'draw':
              this.drawMarker(event.data);
              break;
            case 'add':
              this.pinnedMarker(event.data);
              break;
            case 'remove':
              this.removeMarker(event.data);
              break;
          }
          break;
        case 'polyline':
          switch (event.event) {
            case 'add':
              this.drawPolyLine(event.data);
              break;
          }
          break;
      }
    });
  }

  ngOnInit() {
    this.maps = new naver.maps.Map(this.mapsDiv.nativeElement);
    this.initInstanceMarker();
    this.naverService.initMaps();
  }

  /**
   * 인스턴스 마커 및 인스턴스 마커의 이벤트를 초기화한다.
   */
  initInstanceMarker() {
    this.instanceMarker = new naver.maps.Marker({
      map: this.maps
    });
    naver.maps.Event.addListener(this.instanceMarker, 'click', () => {
      if (this.infoWindow.getMap()) {
        this.closeInfo();
        const infoWindowPoint = this.infoWindow.getPosition();
        const markerPoint = this.instanceMarker.getPosition();
        if (infoWindowPoint && infoWindowPoint['x'] !== markerPoint['x'] && infoWindowPoint['y'] !== markerPoint['y']) {
          this.openInfo(this.instanceMarker, this.instancePlace);
        }
      } else {
        this.openInfo(this.instanceMarker, this.instancePlace);
      }
    });
  }
  moveCenter(point) {
    this.maps.setCenter(point);
  }

  /**
   * 지정된 장소에 인스턴스 마커를 위치시킨다.
   * @param {NaverPlace} place
   */
  drawMarker(place: NaverPlace) {
    const point = place.mapInfo.point;
    let thisMarker = this.markers.find(marker => marker.position.x === point.x && marker.position.y === point.y); // 전달받은 좌표가 존재하는지 확인
    if (!thisMarker) { // 존재하는 좌표가 아니라면
      thisMarker = this.instanceMarker;
      if (!thisMarker.getMap()) {
        thisMarker.setMap(this.maps);
      }
      thisMarker.setPosition(point);
      this.instancePlace = place;
    }
    this.maps.setCenter(point);
    this.openInfo(thisMarker, place);
  }

  /**
   * 해당 위치를 고정된 마커에 추가한다.
   * @param {NaverPlace} place
   */
  pinnedMarker(place: NaverPlace) {
    const point = place.mapInfo.point;
    // 해당 장소가 이미 고정된 장소가 아닌지 확인 후 추가
    if (!this.markers.find(val => val.position.x === point['x'] && val.position.y === point['y'])) {
      // 인스턴스마커와 위치가 동일하다면 인스턴스 마커를 삭제
      if (this.instanceMarker) {
        const position = this.instanceMarker.getPosition();
        if (position.x === point['x'] && position.y === point['y']) {
          this.removeMarker(position);
        }
      }
      const marker = new naver.maps.Marker({
        position: point,
        map: this.maps,
        icon: {
          url: '/assets/pinned.png',
          size: new naver.maps.Size(40, 40),
          scaledSize: new naver.maps.Size(40, 40),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(11, 38)
        }
      });
      this.addListenerMarker(marker, place);
      this.markers.push(marker);
    }
    // 고정된 마커가 여러개라면 추가된 마커를 고려하여 맵의 위치를 재조정
    if (this.markers.length > 1) {
      this.maps.fitBounds(this.markers.map(val => {
        return {x: val.position.x, y: val.position.y};
      }));
    } else { // 처음 추가된 마커라면 해당 마커 위치로 재조정
      this.maps.setCenter(point);
    }
  }
  removeMarker(point: naver.maps.PointObjectLiteral) {
    this.closeInfo(); // 정보창이 열려 있다면 닫는다.
    const removeTargetIndexs = [];
    // 마커는 고정된 마커 또는 인스턴스 마커 중 한 곳에만 유일한 한 값으로 존재한다.
    this.markers.concat(this.instanceMarker).forEach((marker: naver.maps.Marker, index: number, arr) => {
      const markerPosition = marker.getPosition();
      console.log(markerPosition['x'], point['x']);
      if (markerPosition['x'] === point['x'] && markerPosition['y'] === point['y']) {
        if (index < arr.length - 1) { // 인스턴스 마커와 동일한 좌표
          removeTargetIndexs.push(index);
        }
        naver.maps.Event.clearInstanceListeners(marker);
        marker.setMap(null);
      }
    });
    // 고정된 마커에서 삭제될 대상이라면 배열에서 제거한다.
    removeTargetIndexs.reverse().forEach(i => {
      this.markers.splice(i, 1);
    });
  }

  /**
   * 정보창을 초기화한다.
   */
  initInfoWindow() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(InfoWindowComponent);
    this.infoWindowComponent = this.viewContainerRef.createComponent(factory);
    this.infoWindowComponent.instance.place = null;
    this.infoWindow = new naver.maps.InfoWindow({
      content: this.infoWindowComponent.location.nativeElement
    });
  }

  addListenerMarker(marker: naver.maps.Marker, place: NaverPlace) {
    naver.maps.Event.addListener(marker, 'click', () => {
      if (this.infoWindow.getMap()) {
        this.closeInfo();
        const infoWindowPoint = this.infoWindow.getPosition();
        const markerPoint = marker.getPosition();
        if (infoWindowPoint && infoWindowPoint['x'] !== markerPoint['x'] && infoWindowPoint['y'] !== markerPoint['y']) {
          this.openInfo(marker, place);
        }
      } else {
        this.openInfo(marker, place);
      }
    });
  }
  /**
   * 해당 마커 위에 장소 정보를 세팅하여 정보창을 연다.
   * @param marker : 정보창을 표시할 마커의 위치
   * @param {NaverPlace} place : 정보창의 내용
   */
  openInfo(marker: naver.maps.Marker, place: NaverPlace) {
    this.infoWindowComponent.instance.marker = marker;
    this.infoWindowComponent.instance.place = place;
    this.infoWindow.open(this.maps, marker);
  }
  closeInfo() {
    this.infoWindow.close();
  }
  drawPolyLine(data) {
    /** 1. 마커들 간의 간선 거리를 표현한 이차원 배열 준비 */
    const perm = this.makeEdges();
    console.log(perm);

    /** 2. TSP를 이용하여 최단경로를 계산한다. */
    const minPath = this.tsp.shortestPath(perm);
    this.drawEdges(minPath);
  }
  makeEdges() {
    return this.markers.map((marker1: naver.maps.Marker, i) => {
      return this.markers.map((marker2: naver.maps.Marker, j) => {
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
  drawEdges(shortest) {
    if (!this.shortestPath) {
      this.shortestPath = new naver.maps.Polyline({ // 2. 간선에 대한 거리를 계산한다.
        map: this.maps,
        startIcon: naver.maps.PointingIcon.CIRCLE,
        endIcon: naver.maps.PointingIcon.OPEN_ARROW,
        strokeLineJoin: 'round ',
        path: shortest.path.map(v => this.markers[v].getPosition())
      });
    } else {
      this.shortestPath.setPath(shortest.path.map(v => this.markers[v].getPosition()));
    }
  }
}

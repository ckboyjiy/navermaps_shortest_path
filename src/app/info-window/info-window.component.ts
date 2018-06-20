import {Component, Input, OnInit} from '@angular/core';
import {NavermapsService, NaverPlace} from '../service/navermaps.service';
import {MarkerType} from '../service/overlay-factory.service';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent implements OnInit {

  @Input() set marker(marker: naver.maps.Marker) {
    this._marker = marker;
    this.isDepart = false;
    this.isTravel = false;
    if (marker['type'] === MarkerType.DEPART) {
      this.isDepart = true;
    }
    if (marker['type'] === MarkerType.TRAVEL) {
      this.isTravel = true;
    }
  }
  _marker: naver.maps.Marker;
  isDepart: boolean;
  isTravel: boolean;
  constructor(private naverService: NavermapsService) { }

  ngOnInit() {
  }
  isEqualMarker(marker: naver.maps.Marker) {
    return this._marker === marker;
  }
  setDepart() {
    this.naverService.makeDepartMarker(this._marker['place']);
  }
  addTravelPlace() {
    this.naverService.addTravelMarker(this._marker['place']);
  }
  removeMarker() {
    this.naverService.removeMarker(this._marker);
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {NavermapsService, NaverPlace} from '../service/navermaps.service';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent implements OnInit {

  @Input() marker: naver.maps.Marker;
  constructor(private naverService: NavermapsService) { }

  ngOnInit() {
  }
  isEqualMarker(marker: naver.maps.Marker) {
    return this.marker === marker;
  }
  setDepart() {
    this.naverService.makeDepartMarker(this.marker['place']);
  }
  addTravelPlace() {
    this.naverService.addTravelMarker(this.marker['place']);
  }
  removeMarker() {
    this.naverService.removeMarker(this.marker);
  }
}

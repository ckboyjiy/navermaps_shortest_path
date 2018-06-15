import {Component, Input, OnInit} from '@angular/core';
import {NavermapsService, NaverPlace} from '../service/navermaps.service';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent implements OnInit {

  @Input() marker: naver.maps.Marker;
  @Input() place: NaverPlace;
  constructor(private naverService: NavermapsService) { }

  ngOnInit() {
  }
  addPlace() {
    this.naverService.addPinnedMarker(this.place);
  }
  removeMarker() {
    this.naverService.removeMarker(this.place.mapInfo.point);
  }
}

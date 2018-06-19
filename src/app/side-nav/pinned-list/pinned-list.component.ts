import { Component, OnInit } from '@angular/core';
import {NavermapsEvent, NavermapsService, NaverPlace} from '../../service/navermaps.service';
import { filter } from 'rxjs/operators';
import {MarkerType} from '../../service/overlay-factory.service';

@Component({
  selector: 'app-pinned-list',
  templateUrl: './pinned-list.component.html',
  styleUrls: ['./pinned-list.component.scss']
})
export class PinnedListComponent implements OnInit {

  depart: naver.maps.Marker;
  pinnedList: naver.maps.Marker[];
  constructor(private naverService: NavermapsService) {
    this.depart = null;
    this.pinnedList = [];
  }

  ngOnInit() {
    this.naverService.observable.pipe(
      filter((val: NavermapsEvent) => {
        return val.type === 'marker' &&
            (val.event === 'init' || val.event === 'addTravel' || val.event === 'setDepart' || val.event === 'remove');
      })
    ).subscribe(val => {
      if (val.event === 'init') { this.pinnedList = [...val.data]; }
      if (val.event === 'addTravel') { this.pinnedList.push(val.data); }
      if (val.event === 'setDepart') { this.depart = val.data; }
      if (val.event === 'remove') {
        const marker = <naver.maps.Marker> val.data;
        if (marker['type'] === MarkerType.TRAVEL) {
          const removeIndex = this.pinnedList.findIndex(m => m === marker);
          if (removeIndex > -1) {
            this.pinnedList.splice(removeIndex, 1);
          }
        }
        if (marker['type'] === MarkerType.DEPART) {
          this.depart = null;
        }
      }
    });
  }
  removePinnedMarker(marker: naver.maps.Marker) {
    this.naverService.removeMarker(marker);
  }
  getShortestPath() {
    this.naverService.getShortestPath();
  }
}

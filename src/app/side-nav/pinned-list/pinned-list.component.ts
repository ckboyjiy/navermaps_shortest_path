import { Component, OnInit } from '@angular/core';
import {NavermapsEvent, NavermapsService, NaverPlace} from '../../service/navermaps.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pinned-list',
  templateUrl: './pinned-list.component.html',
  styleUrls: ['./pinned-list.component.scss']
})
export class PinnedListComponent implements OnInit {

  pinnedList: NaverPlace[];
  constructor(private naverService: NavermapsService) {
    this.pinnedList = [];
  }

  ngOnInit() {
    this.naverService.observable.pipe(
      filter((val: NavermapsEvent) => val.type === 'marker' && (val.event === 'init' || val.event === 'add' || val.event === 'remove'))
    ).subscribe(val => {
      if (val.event === 'init') {
        this.pinnedList = [...val.data];
      } else if (val.event === 'add') {
        this.pinnedList.push(val.data);
      } else if (val.event === 'remove') {
        const removeIndex = this.pinnedList.findIndex(
          place => place.mapInfo.point.x === val.data['x'] && place.mapInfo.point.y === val.data['y']);
        if (removeIndex > -1) {
          this.pinnedList.splice(removeIndex, 1);
        }
      }
    });
  }
  removePinnedMarker(place: NaverPlace) {
    this.naverService.removeMarker(place.mapInfo.point);
  }
  getShortestPath() {
    this.naverService.getShortestPath();
  }
}

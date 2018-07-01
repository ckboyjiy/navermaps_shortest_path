import {Component, ElementRef, HostBinding, OnInit} from '@angular/core';
import {NavermapsEvent, NavermapsService} from '../../service/navermaps.service';
import { filter } from 'rxjs/operators';
import {MarkerType} from '../../service/overlay-factory.service';
import {JournalService} from '../../service/journal.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pinned-list',
  templateUrl: './pinned-list.component.html',
  styleUrls: ['./pinned-list.component.scss']
})
export class PinnedListComponent implements OnInit {

  depart: naver.maps.Marker;
  pinnedList: naver.maps.Marker[];
  result: any;
  constructor(private naverService: NavermapsService, private journal: JournalService, private router: Router, private el: ElementRef) {
    this.depart = null;
    this.pinnedList = [];
  }

  ngOnInit() {
    this.naverService.observable.pipe(
      filter((val: NavermapsEvent) => val.type === 'marker' || val.type === 'polyline')
    ).subscribe(val => {
      if (val.type === 'marker' && val.event === 'init')      { this.init(val.data); }
      if (val.type === 'marker' && val.event === 'addTravel') { this.pinnedList.push(val.data); }
      if (val.type === 'marker' && val.event === 'setDepart') { this.depart = val.data; }
      if (val.type === 'marker' && val.event === 'remove')    { this._remove(val.data); }
      if (val.type === 'polyline' && val.event === 'shortestPath') { this._resultShortestPath(val.data); }
    });
  }
  init(data: any) {
    if (data.travelList) {
      this.pinnedList = [...data.travelList];
    }
    if (data.depart) {
      this.depart = data.depart;
    }
  }
  removePinnedMarker(marker: naver.maps.Marker) {
    this.naverService.removeMarker(marker);
  }
  getShortestPath() {
    this.naverService.getShortestPath();
  }
  _moveTo(marker: naver.maps.Marker) {
    this.naverService.moveTo(marker);
  }
  _remove(marker: naver.maps.Marker) {
    if (marker['type'] === MarkerType.TRAVEL) {
      const removeIndex = this.pinnedList.findIndex(m => m === marker);
      if (removeIndex > -1) {
        this.pinnedList.splice(removeIndex, 1);
      }
    }
    if (marker['type'] === MarkerType.DEPART) {
      this.depart = null;
    }
    this.result = null;
  }
  _resultShortestPath(result) {
    const temp = [this.depart].concat(this.pinnedList);
    this.result = {
      distance: result.distance,
      path: result.path.map( v => temp[v]['place'])
    };
    requestAnimationFrame(() => {
      this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
    });
  }
  createJournal() {
    this.journal.tempJournal(this.result.path);
    this.naverService.removeAllMarker();
    this.router.navigate([`/journal/new`]);
  }
}

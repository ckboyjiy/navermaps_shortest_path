import { Component, OnInit } from '@angular/core';
import {NavermapsEvent, NavermapsService} from '../../service/navermaps.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss']
})
export class ZoomComponent implements OnInit {

  _zoom: number;
  constructor(private naverService: NavermapsService) {
    this.naverService.observable.pipe(
        filter((v: NavermapsEvent) => v.type === 'map' && v.event === 'zoom')
    ).subscribe(v => {
      this._zoom = v.data;
    });
  }

  ngOnInit() {
  }

  zoom(value) {
    this.naverService.changedZoom(this._zoom + value);
  }
}

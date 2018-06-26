import { Component, OnInit } from '@angular/core';
import {NavermapsService} from '../../service/navermaps.service';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit {

  toggle = false;
  constructor(private naverService: NavermapsService) {
  }

  ngOnInit() {
  }

  toggleWatch() {
    if (!this.toggle) {
      this.naverService.watchGeoLocation();
    } else {
      this.naverService.stopWatch();
    }
    this.toggle = !this.toggle;
  }

}
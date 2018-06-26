import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NaverPlace} from '../../../service/navermaps.service';

@Component({
  selector: 'app-embedded-map',
  templateUrl: './embedded-map.component.html',
  styleUrls: ['./embedded-map.component.scss']
})
export class EmbeddedMapComponent implements OnInit {

  @Input() place: NaverPlace;
  @ViewChild('maps') mapEl: ElementRef;
  maps;
  constructor() { }

  ngOnInit() {
    this.maps = new naver.maps.Map(this.mapEl.nativeElement, {
      disableKineticPan: false,
      draggable: false,
      scaleControl: false,
      scrollWheel: false,
      center: this.place.mapInfo.point
    });
    const marker = new naver.maps.Marker({
      position: this.place.mapInfo.point,
      map: this.maps
    });
  }

}

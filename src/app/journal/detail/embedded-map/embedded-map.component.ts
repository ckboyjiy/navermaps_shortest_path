import {Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from '@angular/core';
import {NaverPlace} from '../../../service/navermaps.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-embedded-map',
  templateUrl: './embedded-map.component.html',
  styleUrls: ['./embedded-map.component.scss'],
  animations: [
    trigger('show', [
      state('true', style({
        visibility: 'visible',
        opacity: 1
      })),
      state('false', style({
        visibility: 'hidden',
        opacity: 0
      })),
      transition('true => false', animate('0.1s')),
      transition('false => true', animate('0.2s'))
    ]),
    trigger('expand', [
      state('true', style({
        width: '100%',
        height: '50vh',
        'z-index': 502
      })),
      state('false', style({
        width: '50%'
      })),
      transition('true => false', animate('0.2s')),
      transition('false => true', animate('0.1s'))
    ]),
    trigger('shrink', [
      state('true', style({
        width: '0px',
        overflow: 'hidden',
        height: '0px'
      })),
      state('false', style({
        width: '50%'
      })),
      transition('true => false', animate('0.2s')),
      transition('false => true', animate('0.1s'))
    ])
  ]
})
export class EmbeddedMapComponent implements OnInit {

  @Input() place: NaverPlace;
  @ViewChild('maps') mapEl: ElementRef;
  maps;
  isBubble = false;
  constructor(private host: ElementRef) { }

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

  clickMap() {
    if (this.isBubble === false) {
      this.isBubble = true;
    }
  }
  resizeMap() {
    const width = getComputedStyle(this.mapEl.nativeElement).getPropertyValue('width');
    const height = getComputedStyle(this.mapEl.nativeElement).getPropertyValue('height');
    this.maps.setSize([width, height]);
    if (this.isBubble) {
      console.log(document.getElementsByTagName('app-detail').item(0).scrollTop, this.mapEl.nativeElement.scrollHeight);
      document.body.scrollTop = this.mapEl.nativeElement.scrollHeight;
      this.maps.setOptions('draggable', true);
      this.maps.setOptions('scaleControl', true);
      this.maps.setOptions('scrollWheel', true);
    } else {
      this.maps.setOptions('draggable', false);
      this.maps.setOptions('scaleControl', false);
      this.maps.setOptions('scrollWheel', false);
      this.maps.setZoom(11);
    }
    this.maps.setCenter(this.place.mapInfo.point);
  }
}

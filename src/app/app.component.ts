import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

declare const naver: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('isOpen', [
      state('true', style({
        width: '250px'
      })),
      state('false', style({
        width: '0px'
      })),
      transition('* => true', animate('500ms ease-in')),
      transition('* => false', animate('500ms ease-in'))
    ])
  ]
})
export class AppComponent implements OnInit {
  isShow = false;
  constructor() {}
  ngOnInit() {
  }
  openNav() {
    this.isShow = !this.isShow;
  }
  onClick(event) {
    if (this.isShow === true) {
      this.openNav();
    }
  }
}

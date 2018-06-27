import {Component, HostBinding, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {routerAnimation} from '../animations/routerAnimation';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
      routerAnimation,
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
export class MainComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
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

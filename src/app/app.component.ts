import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

declare const naver: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sideNav') sideNav: ElementRef;
  @ViewChild('main') main: ElementRef;
  isShow = false;
  left = 0;
  constructor() {}
  ngOnInit() {
  }
  openNav() {
    if (this.isShow = !this.isShow) {
      this.sideNav.nativeElement.style.width = '250px';
      this.main.nativeElement.style.marginLeft = '250px';
      this.left = 250;
    } else {
      this.sideNav.nativeElement.style.width = '0px';
      this.main.nativeElement.style.marginLeft = '0px';
      this.left = 0;
    }
  }
  onClick(event) {
    if (this.isShow === true) {
      this.openNav();
    }
  }
}

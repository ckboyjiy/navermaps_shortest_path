import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

declare var naver: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sideNav') sideNav: ElementRef;
  @ViewChild('main') main: ElementRef;
  isShow = false;
  constructor() {}
  ngOnInit() {
  }
  openNav() {
    if (this.isShow = !this.isShow) {
      this.sideNav.nativeElement.style.width = '250px';
      this.main.nativeElement.style.marginLeft = '250px';
    } else {
      this.sideNav.nativeElement.style.width = '0px';
      this.main.nativeElement.style.marginLeft = '0px';
    }

  }
}

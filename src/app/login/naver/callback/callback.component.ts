import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  ngOnInit() {
    const params = {};
    const hash = location.hash.substring(1);
    const regex = /([^#?&=]+)=([^&]*)/g;
    let match;
    while ((match = regex.exec(hash)) !== null) {
      params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    window.opener.dispatchEvent(new CustomEvent('auth_complete', {
      detail: params
    }));
  }

  complete() {
    window.close();
  }
}

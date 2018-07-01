import {Component, OnInit} from '@angular/core';
import * as shortid from 'shortid';
import {AuthService} from '../../service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-naver',
  templateUrl: './naver.component.html',
  styleUrls: ['./naver.component.scss']
})
export class NaverComponent implements OnInit {

  state: string;
  redirectUrl: string;
  isLogin: boolean;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.redirectUrl = this.route.snapshot.paramMap.get('redirect') ? this.route.snapshot.paramMap.get('redirect') : '/'
    this.authService.isLogin().subscribe(result => {
      this.isLogin = result;
    });
  }

  ngOnInit() {
  }

  login() {
    this.state = encodeURIComponent(shortid.generate());
    const options = 'titlebar=1, resizable=1, scrollbars=yes, width=450, height=200';
    window.open(this.authService.getAuthorizeUrl(this.state), 'naverloginpop', options);
    const trigger = e => {
      if (e.detail.state === this.state) {
        this.authService.setToken(e.detail.access_token, () => {
          this.isLogin = true;
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
          }
        });
      }
      window.removeEventListener('auth_complete', trigger);
    };
    window.addEventListener('auth_complete', trigger);
  }
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.isLogin = false;
    this.router.navigate(['/']);
  }
  click() {
    if (this.isLogin) {
      this.logout();
    } else {
      this.login();
    }
  }
}

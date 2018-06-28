import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _redirect_uri = 'http://localhost:4200/login/naver/callback';
  private _authorize_uri = 'https://nid.naver.com/oauth2.0/authorize';
  private _profile_uri = 'https://openapi.naver.com/v1/nid/getUserProfile.json';
  constructor(private http: HttpClient) { }
  /**
   * access_token을 얻기위한 url을 생성한다.
   * @returns {string}
   */
  getAuthorizeUrl(state: string) {
    const cid = environment.clientId;
    const type = 'token';
    return `${this._authorize_uri}?response_type=${type}&client_id=${cid}&redirect_uri=${this._redirect_uri}&state=${state}`;
  }

  /**
   * 토큰정보를 저장하고 프로필 정보를 조회한다.
   * @param {string} token
   */
  setToken(token: string, callback?: () => void) {
    localStorage.setItem('token', token);
    this.setProfile(token).subscribe(result => {
      if (result) {
        callback();
      }
    });
  }
  /**
   * 프로필 정보를 조회 후 세션에 저장한다.
   * @param {string} token
   */
  setProfile(token: string): Observable<boolean> {
    return Observable.create(subscriber => {
      const url = `${this._profile_uri}?response_type=json&access_token=${encodeURIComponent(token)}`;
      this.http.jsonp(url, 'oauth_callback').subscribe((v: any) => {
        if (v.resultcode === '00') {
          sessionStorage.setItem('user', JSON.stringify(v.response));
          subscriber.next(true);
        } else {
          localStorage.removeItem('token');
          subscriber.next(false);
        }
        subscriber.complete();
      });
    });
  }

  /**
   * 인증정보를 확인한다.
   * @returns {Observable<boolean>}
   */
  isLogin(): Observable<boolean> {
    return Observable.create(subscriber => {
      // 유저정보가 있는가?
      const user = sessionStorage.getItem('user');
      if (!sessionStorage.getItem('user')) {
        // 없다면
        const token = localStorage.getItem('token');
        // 토큰은 존재하는가?
        if (token) {
          // 있다면
          this.setProfile(token).subscribe(v => {
            subscriber.next(v);
          });
        } else {
          // 없다면 인증정보 없음
          subscriber.next(false);
        }
      } else {
        subscriber.next(true);
      }
      subscriber.complete();
    });
  }
  getProfile() {
    return JSON.parse(sessionStorage.getItem('user'));
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _redirect_uri: string;
  _authorize_uri = 'https://nid.naver.com/oauth2.0/authorize';
  _profile_uri = 'https://openapi.naver.com/v1/nid/getUserProfile.json';
  get userId() {
    return JSON.parse(sessionStorage.getItem('user')).email;
  }
  constructor(private http: HttpClient) {
    if (location.hostname === 'localhost') {
      this._redirect_uri = 'http://';
    } else {
      this._redirect_uri = 'https://';
    }
    this._redirect_uri += location.host + '/login/naver/callback';
  }
  /**
   * access_token을 얻기위한 url을 생성한다.
   * @returns {string}
   */
  getAuthorizeUrl(state: string) {
    const cid = location.host.indexOf('-stg') === -1 ? environment.clientId : environment.clientIdStg;
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
    const user = sessionStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user) {
      return of(true);
    } else if (!user && !token) {
      return of(false);
    } else {
      return this.setProfile(token);
    }
  }
  getProfile() {
    return JSON.parse(sessionStorage.getItem('user'));
  }
}

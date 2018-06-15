import { Injectable } from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {map, first} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  constructor(private http: HttpClient) { }
  searchAddress(address: string): Observable<any> {
    if (address) {
      return Observable.create(observer => {
        naver.maps.Service.geocode({address: address}, (status, response) => {
          if (status === naver.maps.Service.Status.OK) {
            observer.next(response.result.items);
          }
        });
      });
    } else {
      return EMPTY;
    }
  }

  /**
   *
   * @param {string} keyword
   * @returns {Observable<any>}
   */
  search(keyword: string): Observable<any> {
    return Observable.create(observer => {
      // naver 검색 API를 통해 장소를 검색한다.
      this.http.jsonp(`${environment.apiUrl}/api/place/search?query=${keyword}`, 'callback').pipe(
        /** 데이터 가공 **/
        map((resultString: string) => {
          const result = JSON.parse(decodeURIComponent(resultString)); // 인코딩 처리 및 JSON 객체화
          result.items.forEach(data => {
            delete data.mapx; // 검색을 통한 좌표는 삭제한다
            delete data.mapy; // 검색을 통한 좌표는 삭제한다
            // 지도 API의 좌표정보를 얻어와서 데이터에 추가
            this.searchAddress(data.address).pipe(first()).subscribe(info => data.mapInfo = info[0]);
            delete data.address; // 검색을 통한 주소는 삭제한다
          });
          return result;
        })
      ).subscribe((data: any) => {
        /** 검색결과가 하나도 없으면 **/
        if (data.total === 0) {
          /** 주소 검색을 통해 결과값을 가공 **/
          this.searchAddress(keyword).subscribe((mapsInfo: any[]) => {
            mapsInfo.forEach(mapInfo => {
              const result = {
                title: keyword,
                mapInfo: mapInfo
              };
              data.items.push(result);
              data.total++;
              data.display++;
            });
          });
        }
        observer.next(data);
        observer.complete();
      });
    });
  }
}

import { Injectable } from '@angular/core';
import {Store} from '../store';
import {Journal} from '../../journal.service';
import {AuthService} from '../../auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalStore extends Store {

  storeName: string;
  constructor(private auth: AuthService) {
    super('journal', 'id', [
      { name: 'byEmail', index: 'email'}
    ]);
    this.storeName = 'journal';
  }
  get(query: any, index?: string): Observable<any> {
    if (index) {
      return this._get(query, index);
    } else {
      return this._get(query);
    }
  }
  getAll(): Observable<any> {
    return this.get(this.auth.userId, 'byEmail');
  }
  add(journal: Journal) {
    journal.email = this.auth.userId;
    journal.date = Date.now();
    this._add(journal).subscribe(result => {
      console.log(result);
    });
  }
}

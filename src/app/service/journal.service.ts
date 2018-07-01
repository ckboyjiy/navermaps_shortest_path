import { Injectable } from '@angular/core';
import {NaverPlace} from './navermaps.service';
import * as shortid from 'shortid';
import {JournalStore} from './store/journal/journal.service';
import {map} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor(private store: JournalStore) { }
  tempJournal(list: JournalContents[]): Journal {
    const journal = {
      id: shortid.generate(),
      title: '새로운 여행일지',
      contents: list
    };
    localStorage.setItem('tempJournal', JSON.stringify(journal));
    return journal;
  }
  getAllJournal() {
    return this.store.getAll();
  }
  getJournal(id: string) {
    let result;
    if (id === 'tempJournal') {
      result = of(JSON.parse(localStorage.getItem(id)));
      localStorage.removeItem(id);
    } else {
      result = this.store.get(id).pipe(
          map(v => {
            if (v.length > 0) {
              return v[0];
            } else {
              return null;
            }
          })
      );
    }
    return result;
  }
  saveJournal(journal: Journal) {
    console.log(journal);
    localStorage.setItem(journal.id, JSON.stringify(journal));
    this.store.add(journal);
  }
}

export interface Journal {
  id: string;
  title: string;
  email?: string;
  date?: number;
  contents: JournalContents[];
}

export interface JournalContents extends NaverPlace {
  journal?: string;
  toDate?: Date;
  fromDate?: Date;
}

import { Injectable } from '@angular/core';
import {NaverPlace} from './navermaps.service';
import * as shortid from 'shortid';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor() { }
  tempJournal(list) {
    const journal = {
      id: shortid.generate(),
      title: '새로운 여행일지',
      contents: <JournalContents>list
    };
    localStorage.setItem('tempJournal', JSON.stringify(journal));
    return journal;
  }
  getTempJournal(): Journal {
    return JSON.parse(localStorage.getItem('tempJournal'));
  }
  getAllJournal() {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      try {
        const key = localStorage.key(i);
        if (key !== 'tempJournal') {
          result.push(JSON.parse(localStorage.getItem(key)));
        }
      } catch (e) {}
    }
    return result.filter(v => v.hasOwnProperty('id'));
  }
  getJournal(id: string) {
    return JSON.parse(localStorage.getItem(id));
  }
  saveJournal(journal: Journal) {
    console.log(journal);
    localStorage.setItem(journal.id, JSON.stringify(journal));
  }
}

export interface Journal {
  id: string;
  title: string;
  date: Date;
  contents: JournalContents[];
}

export interface JournalContents extends NaverPlace {
  journal?: string;
  toDate?: Date;
  fromDate?: Date;
}

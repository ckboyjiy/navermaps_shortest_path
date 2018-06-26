import { Component, OnInit } from '@angular/core';
import {Journal, JournalService} from '../service/journal.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  journals: Journal[];
  constructor(private journalService: JournalService, private router: Router) { }

  ngOnInit() {
    this.journals = this.journalService.getAllJournal();
  }
  getPath(journal: Journal) {
    return journal.contents.filter((v, i, a) => i > 0 && i < a.length - 1).map(v => v.title).join(' -> ');
  }
  go(id: string) {
    this.router.navigate([`/journal/${id}`]);
  }
}

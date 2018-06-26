import {Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {Journal, JournalService} from '../../service/journal.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  _id: string;
  set id(id: string) {
    this._id = id;
    this.journal = this.journalService.getJournal(id);
  }
  title: string;
  journal: Journal;
  constructor(private journalService: JournalService, private route: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
  }
  getList() {
    return this.journal.contents.filter( (v, i, a) => i > 0 && i < a.length - 1);
  }
  save() {
    this.journal.date = new Date(Date.now());
    this.journalService.saveJournal(this.journal);
  }
  back() {
    this.location.back();
  }
}

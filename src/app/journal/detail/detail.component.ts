import {Component, HostBinding, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {Journal, JournalService} from '../../service/journal.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {routerAnimation} from '../../animations/routerAnimation';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations: [routerAnimation]
})
export class DetailComponent implements OnInit {

  @HostBinding('@routeAnimation') routeAnimation = true;
  _id: string;
  set id(id: string) {
    this._id = id;
    this.journalService.getJournal(id).subscribe(journal => this.journal = journal);
  }
  title: string;
  journal: Journal;
  constructor(private journalService: JournalService, private route: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id') === 'new' ? 'tempJournal' : params.get('id');
    });
  }
  getList() {
    return this.journal.contents.filter( (v, i, a) => i > 0 && i < a.length - 1);
  }
  save() {
    this.journal.date = Date.now();
    this.journalService.saveJournal(this.journal);
    this.router.navigate(['/journal']);
  }
  back() {
    this.location.back();
  }
}

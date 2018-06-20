import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {GeocoderService} from '../service/geocoder.service';
import {NavermapsService, NaverPlace} from '../service/navermaps.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('isShrink', [
      state('true', style({
        marginLeft: '255px'
      })),
      state('false', style({
        marginLeft: '5px'
      })),
      transition('* => true', animate('500ms ease-in')),
      transition('* => false', animate('500ms ease-in'))
    ])
  ]
})
export class MainComponent implements OnInit {
  @Input() isShrink: boolean;
  @Output() openNav = new EventEmitter();
  searchForm: FormGroup;
  textCtrl: FormControl;
  retrievedPlaces: any[];
  isShow = false;
  constructor(
    private fb: FormBuilder,
    private naverService: NavermapsService,
    private geocoder: GeocoderService) {
    this.textCtrl = fb.control('');
    this.searchForm = fb.group({
      text: this.textCtrl
    });

    this.textCtrl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(val => {
      if (val) {
        this.geocoder.search(val).subscribe(
          places => {
            console.log(places);
            this.retrievedPlaces = places.items;
          }
        );
      } else {
        this.retrievedPlaces = [];
      }
    });
  }

  ngOnInit() {
  }
  clickMenu(event) {
    event.stopPropagation();
    this.openNav.emit(true);
  }
  clickPlace(place: NaverPlace) {
    this.naverService.drawMarker(place);
    this.isShow = false;
  }
}

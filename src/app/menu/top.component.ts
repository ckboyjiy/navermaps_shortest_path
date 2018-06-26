import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {GeocoderService} from '../service/geocoder.service';
import {NavermapsService, NaverPlace} from '../service/navermaps.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
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
export class TopComponent implements OnInit {
  @Input() isShrink: boolean;
  @Output() openNav = new EventEmitter();
  @ViewChild('text') textEl: ElementRef;
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
    // this.triggerCompositionEnd();
  }
  clickMenu(event) {
    event.stopPropagation();
    this.openNav.emit(true);
  }
  clickPlace(place: NaverPlace) {
    this.naverService.drawMarker(place);
    this.isShow = false;
  }

  /**
   * input의 한글 입력 시 compositionend 이벤트가 늦게 발생되는 문제를 처리하기 위한 작업
   */
  triggerCompositionEnd() {
    Observable.create(subscriber => {
      this.textEl.nativeElement.addEventListener('compositionupdate', (event) => {
        subscriber.next(event);
      });
    }).pipe(
        debounceTime(200),
        distinctUntilChanged()
    ).subscribe(e => {
      e.target.dispatchEvent(new CompositionEvent('compositionend', e));
    });
  }
}

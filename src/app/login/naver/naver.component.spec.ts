import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaverComponent } from './naver.component';

describe('NaverComponent', () => {
  let component: NaverComponent;
  let fixture: ComponentFixture<NaverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

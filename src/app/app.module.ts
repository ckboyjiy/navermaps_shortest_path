import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule, MatIconModule, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';

import { AppComponent } from './app.component';
import { HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { MapsComponent } from './maps/maps.component';
import { StripTagPipe } from './pipes/strip-tag.pipe';
import { SideNavComponent } from './side-nav/side-nav.component';
import { PinnedListComponent } from './side-nav/pinned-list/pinned-list.component';
import { ZoomComponent } from './main/zoom/zoom.component';
import { GpsComponent } from './main/gps/gps.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    InfoWindowComponent,
    MapsComponent,
    StripTagPipe,
    SideNavComponent,
    PinnedListComponent,
    ZoomComponent,
    GpsComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule, HttpClientJsonpModule, FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatDialogModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    HttpClientModule, HttpClientJsonpModule
  ],
  entryComponents: [
    MainComponent, InfoWindowComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

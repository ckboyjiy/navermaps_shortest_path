import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule, MatIconModule, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';

import { AppComponent } from './app.component';
import { HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';
import { TopComponent } from './menu/top.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { MapsComponent } from './maps/maps.component';
import { StripTagPipe } from './pipes/strip-tag.pipe';
import { SideNavComponent } from './side-nav/side-nav.component';
import { PinnedListComponent } from './side-nav/pinned-list/pinned-list.component';
import { ZoomComponent } from './menu/zoom/zoom.component';
import { GpsComponent } from './menu/gps/gps.component';
import { DistancePipe } from './pipes/distance.pipe';
import { MainComponent } from './main/main.component';
import { JournalComponent } from './journal/journal.component';
import {RoutingModule} from './routing/routing.module';
import { DetailComponent } from './journal/detail/detail.component';
import { EditableTextComponent } from './journal/detail/editable-text/editable-text.component';
import { EmbeddedMapComponent } from './journal/detail/embedded-map/embedded-map.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TopComponent,
    InfoWindowComponent,
    MapsComponent,
    StripTagPipe,
    SideNavComponent,
    PinnedListComponent,
    ZoomComponent,
    GpsComponent,
    DistancePipe,
    JournalComponent,
    DetailComponent,
    EditableTextComponent,
    EmbeddedMapComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule, HttpClientJsonpModule, FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatDialogModule, RoutingModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    HttpClientModule, HttpClientJsonpModule
  ],
  entryComponents: [
    InfoWindowComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

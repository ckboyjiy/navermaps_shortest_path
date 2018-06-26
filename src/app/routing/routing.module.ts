import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from '../main/main.component';
import {JournalComponent} from '../journal/journal.component';
import {DetailComponent} from '../journal/detail/detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/main', pathMatch: 'full'},
  {path: 'main', component: MainComponent},
  {path: 'journal', component: JournalComponent},
  {path: 'journal/:id', component: DetailComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }

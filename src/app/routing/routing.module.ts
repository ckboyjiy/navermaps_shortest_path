import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from '../main/main.component';
import {JournalComponent} from '../journal/journal.component';
import {DetailComponent} from '../journal/detail/detail.component';
import {CallbackComponent} from '../login/naver/callback/callback.component';
import {AuthenticateGuard} from './authenticate.guard';
import {LoginComponent} from '../login/login.component';

const routes: Routes = [
  {path: '', redirectTo: '/main', pathMatch: 'full'},
  {path: 'main', component: MainComponent},
  {path: 'journal', component: JournalComponent, canActivate: [AuthenticateGuard]},
  {path: 'journal/:id', component: DetailComponent, canActivate: [AuthenticateGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'login/naver/callback', component: CallbackComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }

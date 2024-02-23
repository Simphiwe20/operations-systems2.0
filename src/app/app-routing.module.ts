import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { LandingComponent } from './components/landing/landing.component';
import { LeaveComponent } from './components/leave/leave.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GuesthouseComponent } from './components/guesthouse/guesthouse.component';
import { VisaComponent } from './components/visa/visa.component';
import { TransportComponent } from './components/transport/transport.component';
import { TravelComponent } from './components/travel/travel.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { UsersComponent } from './components/users/users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', redirectTo: '/log-in', pathMatch: 'full'},
  {path: 'log-in', component: LogInComponent},
  {path: 'landing', component:LandingComponent, children: [
    {path: 'users', component: UsersComponent},
    {path: 'leaves', component: LeaveComponent},
    {path: 'policies', component: PoliciesComponent},
    {path: 'dashboard', component:DashboardComponent},
    {path: 'guesthouse', component: GuesthouseComponent},
    {path: 'visa', component: VisaComponent},
    {path: 'transport', component: TransportComponent},
    {path: 'travels', component: TravelComponent},
]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

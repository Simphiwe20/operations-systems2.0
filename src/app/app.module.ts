import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/materials/materials.module';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeaveComponent } from './components/leave/leave.component';
import { GuesthouseComponent } from './components/guesthouse/guesthouse.component';
import { VisaComponent } from './components/visa/visa.component';
import { TransportComponent } from './components/transport/transport.component';
import { TravelComponent } from './components/travel/travel.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { UsersComponent } from './components/users/users.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LeaveFormComponent } from './forms/leave-form/leave-form.component';
import { GuesthouseFormComponent } from './forms/guesthouse-form/guesthouse-form.component';
import { VisaFormComponent } from './forms/visa-form/visa-form.component';
import { TransportFormComponent } from './forms/transport-form/transport-form.component';
import { TravelFormComponent } from './forms/travel-form/travel-form.component';
import { DeletePopUpComponent } from './popUps/delete-pop-up/delete-pop-up.component';
import { NotificationsComponent } from './popUps/notifications/notifications.component';
import { PieChartComponent } from './shared/pie-chart/pie-chart.component';
import { LineGraphComponent } from './shared/line-graph/line-graph.component';
import { RequestCardsComponent } from './shared/request-cards/request-cards.component';
import { LeavesCardComponent } from './shared/leaves-card/leaves-card.component';
import { TableComponent } from './shared/table/table.component';
import { LoaderComponent } from './shared/loader/loader.component'

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DashboardComponent,
    LeaveComponent,
    GuesthouseComponent,
    VisaComponent,
    TransportComponent,
    TravelComponent,
    LogInComponent,
    UsersComponent,
    PoliciesComponent,
    PageNotFoundComponent,
    ProfileComponent,
    LeaveFormComponent,
    GuesthouseFormComponent,
    VisaFormComponent,
    TransportFormComponent,
    TravelFormComponent,
    DeletePopUpComponent,
    NotificationsComponent,
    PieChartComponent,
    LineGraphComponent,
    RequestCardsComponent,
    LeavesCardComponent,
    TableComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

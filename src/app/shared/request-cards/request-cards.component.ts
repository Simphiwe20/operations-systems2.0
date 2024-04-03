import { Component } from '@angular/core';
import { ChartServicesService } from 'src/app/services/chart-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-request-cards',
  templateUrl: './request-cards.component.html',
  styleUrls: ['./request-cards.component.scss']
})
export class RequestCardsComponent {
  user: any;
  users: any;
  allLeaves: number = 0
  leaveSubmitted: number = 0
  leaveApproved: number = 0
  leaveRejected: number = 0
  guesthouseSubmitted: number = 0
  guesthouseApproved: number = 0
  guesthouseRejected: number = 0
  visaSubmitted: number = 0
  visaApproved: number = 0
  visaRejected: number = 0
  travelsSubmitted: number = 0
  travelsApproved: number = 0
  travelsRejected: number = 0
  transportSubmitted: number = 0
  transportApproved: number = 0
  transportRejected: number = 0

  constructor(private charts: ChartServicesService, private sharedService: SharedServicesService) {


    this.users = this.sharedService.getData('local', 'users')
    this.user = this.sharedService.getData('session', 'user')

    // Leaves status
    this.leaveApproved = this.charts.approved
    this.leaveRejected = this.charts.rejected
    this.leaveSubmitted = this.charts.submitted
    this.allLeaves = this.leaveRejected + this.leaveSubmitted + this.leaveApproved

    this.charts.getReqStats(this.user, 'guesthouse')
    this.guesthouseSubmitted = this.charts.submitted
    this.guesthouseApproved = this.charts.approved
    this.guesthouseRejected = this.charts.rejected
    console.log(this.guesthouseSubmitted)

    // Visa status
    this.charts.getReqStats(this.user, 'visas')
    this.visaSubmitted = this.charts.submitted
    this.visaApproved = this.charts.approved
    this.visaRejected = this.charts.rejected

    // travels status
    this.charts.getReqStats(this.user, 'travels')
    this.travelsSubmitted = this.charts.submitted
    this.travelsApproved = this.charts.approved
    this.travelsRejected = this.charts.rejected

    // transport status
    this.charts.getReqStats(this.user, 'transport')
    this.transportSubmitted = this.charts.submitted
    this.transportApproved = this.charts.approved
    this.transportRejected = this.charts.rejected
  }

}

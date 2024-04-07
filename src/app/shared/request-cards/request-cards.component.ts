import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { ChartServicesService } from 'src/app/services/chart-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-request-cards',
  templateUrl: './request-cards.component.html',
  styleUrls: ['./request-cards.component.scss']
})
export class RequestCardsComponent implements AfterViewChecked{
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
  currentUser: any;
  request: any;
  requests: any[] = [
    {reqName: 'GuestHouse', statuses: [{Pending: 0, Approved: 0, Declined: 0}]}, 
    {reqName: 'Travel', statuses: [{Pending: 0, Approved: 0, Declined: 0}]}, 
    {reqName: 'Transport', statuses: [{Pending: 0, Approved: 0, Declined: 0}]},
    {reqName: 'Visa', statuses: [{Pending: 0, Approved: 0, Declined: 0}]}
  ]
  // status: any[] = [] 

  constructor(private charts: ChartServicesService, private sharedService: SharedServicesService,
    private cdr: ChangeDetectorRef) {
    this.currentUser = this.sharedService.getData('session', 'user')

    this.request = ['/getGHRequests', '/getTransport', '/getTravel', '/getVisas']

    this.charts.getLeavesNo(this.currentUser)
    this.request.forEach(async (req: any) => {
      console.log(req)
      await this.charts.getReqs(this.currentUser, req)
      let sub = this.charts.done.subscribe(
        data => console.log(data)
      )
      sub.unsubscribe()
    })
    // Leaves status
    this.leaveApproved = this.charts.approved
    this.leaveRejected = this.charts.declined
    this.leaveSubmitted = this.charts.pending
    this.allLeaves = this.leaveRejected + this.leaveSubmitted + this.leaveApproved

    this.charts.getReqStats(this.user, 'guesthouse')
    this.guesthouseSubmitted = this.charts.pending
    this.guesthouseApproved = this.charts.approved
    this.guesthouseRejected = this.charts.declined
    console.log(this.guesthouseSubmitted)

    // Visa status
    this.charts.getReqStats(this.user, 'visas')
    this.visaSubmitted = this.charts.pending
    this.visaApproved = this.charts.approved
    this.visaRejected = this.charts.declined

    // travels status
    this.charts.getReqStats(this.user, 'travels')
    this.travelsSubmitted = this.charts.pending
    this.travelsApproved = this.charts.approved
    this.travelsRejected = this.charts.declined

    // transport status
    this.charts.getReqStats(this.user, 'transport')
    this.transportSubmitted = this.charts.pending
    this.transportApproved = this.charts.approved
    this.transportRejected = this.charts.declined
  }

  ngAfterViewChecked(): void {
    this.getStats()
    this.cdr.detectChanges()
    console.log( this.charts.approved)
  }


  getStats() {
    let reqNames: any = this.requests.filter((_req: any) => _req.reqName)
    console.log(reqNames)
    // this.requests.forEach((req: any, indx: number) => {
    //   if(req.reqName === '')
    // })
    this.guesthouseSubmitted = this.charts.guestHousePending
    this.guesthouseApproved = this.charts.guestHouseApproved
    this.guesthouseRejected = this.charts.guestHouseDeclined
    this.visaSubmitted = this.charts.visaPending
    this.visaApproved = this.charts.visaApproved
    this.visaRejected = this.charts.visaDeclined
    this.travelsSubmitted = this.charts.travelPending
    this.travelsApproved = this.charts.travelApproved
    this.travelsRejected = this.charts.travelDeclined
    this.transportSubmitted = this.charts.transportPending
    this.transportApproved = this.charts.transportApproved
    this.transportRejected = this.charts.transportDeclined
  }

}

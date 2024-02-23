import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, PieController, registerables } from 'chart.js';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import * as Chartjs from "chart.js";
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { ChartServicesService } from 'src/app/services/chart-services.service';

Chart.register(PieController)
Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit{
  public chart: any;
  users: any;
  user: any;
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
  TotUsers: number = 0
  requests: any;
  reqs: any;

  // Pie
  public pieChartOptions: Chartjs.ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [['Active'], ['Disable']];
  public pieChartDatasets = [{
    data: [this.charts.active, this.charts.disabled]
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  @ViewChild('leaveChart') leavesChart!: ElementRef

  public context!: CanvasRenderingContext2D;

  // Line Graph
  public lineChartData: Chartjs.ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Users',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: Chartjs.ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;


  constructor(private sharedService: SharedServicesService, private router: Router,
    private api: ApiServicesService, private charts: ChartServicesService) {
    this.users = this.sharedService.getData('local', 'users')
    this.user = this.sharedService.getData('session', 'user')
    this.charts.getLeavesNo(this.user)
    this.charts.getDep(this.user)
    this.charts.getUserStats()

    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res) => {
          if (!Object.keys(res).length) {
            this.router.navigate(['/log-in'])
            sessionStorage.clear()
          }
        },
        error: (err) => { console.log(err) },
        complete: () => { }
      })

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

    this.TotUsers = this.charts.usersTot

    this.charts.getReqs(this.user)
    this.charts.getReqs(this.user)
    console.log(this.charts.guesthouseReq)
    console.log(this.charts.rejected)
    console.log(this.charts.submitted)

    this.reqs = [{ name: 'GuestHouse', status: [this.guesthouseSubmitted, this.guesthouseApproved, this.guesthouseRejected] },
    { name: 'Travel', status: [this.travelsSubmitted, this.travelsApproved, this.travelsRejected] },
    { name: 'Transport', status: [this.transportSubmitted, this.transportApproved, this.transportRejected] },
    { name: 'GuestHouse', status: [this.guesthouseSubmitted, this.guesthouseApproved, this.guesthouseRejected] }]

  }

  ngAfterViewInit(): void {
    if (this.user.role === 'employee') {
      this.createChart()
    } else if (this.user.role === 'admin') {
      this.DepChart()
    } else if (this.user.role === 'manager') {
      this.managerChart()
      this.reqChart()
    } else {
      this.createChart()
    }


  }


  createChart() {

    this.chart = new Chart(this.context, {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Submitted Leaves', 'Approved Leaves', 'Rejected Leaves'],
        datasets: [{
          label: 'My First Dataset',
          data: [this.leaveSubmitted, this.leaveApproved, this.leaveRejected],
          backgroundColor: [
            'green',
            'orange',
            'blue',
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
      }

    });
  }

  DepChart() {
    this.chart = new Chart("leavesChart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['IT', 'Marketing', 'Sales', 'Operations', 'Others'],
        datasets: [{
          label: 'My First Dataset',
          data: [this.charts.itCount, this.charts.makertingCount, this.charts.salesCount, this.charts.operationsCount, this.charts.other],
          backgroundColor: [
            'green',
            'orange',
            'blue',
            'yellow',
            'purple'
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        responsive: false
      }

    });
  }


  managerChart() {

    this.chart = new Chart("leavesChart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Submitted Leaves', 'Approved Leaves', 'Rejected Leaves'],
        datasets: [{
          label: 'My First Dataset',
          data: [this.leaveSubmitted, this.leaveApproved, this.leaveRejected],
          backgroundColor: [
            'green',
            'orange',
            'blue',
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
      }

    });
  }

  reqChart() {

    this.chart = new Chart("requestsChart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Visa', 'GuestHouse', 'Travels', 'Transport'],
        datasets: [{
          label: 'My First Dataset',
          data: [this.charts.visaReq, this.charts.guesthouseReq, this.charts.travelReq, this.charts.transportReq],
          backgroundColor: [
            'green',
            'orange',
            'blue',
            'yellow'
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
      }

    });
  }
}

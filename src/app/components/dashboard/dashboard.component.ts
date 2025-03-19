import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, PieController, registerables } from 'chart.js';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import * as Chartjs from "chart.js";
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { ChartServicesService } from 'src/app/services/chart-services.service';
import { NotificationsComponent } from 'src/app/popUps/notifications/notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  TotUsers: number = 0
  requests: any;
  reqs: any;
  leaveSubmitted: number = 0
  leaveApproved: number = 0
  leaveRejected: number = 0
  showLoader: boolean = true

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
    private api: ApiServicesService, private charts: ChartServicesService, private snackBar: MatSnackBar) {
    this.user = this.sharedService.getData('session', 'user')
    this.charts.getLeavesNo(this.user)
    // this.charts.getDep(this.user)
    this.charts.getUserStats()
    console.log(this.charts.disabled, 'From DashBoard')

    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res) => {
          if (!Object.keys(res).length) {
            this.router.navigate(['/log-in'])
            sessionStorage.clear()
          }
          this.showLoader = false
        },
        error: (err) => { 
          this.showLoader = false;
          this.snackBar.open(err.Error, 'OK', {duration: 3000}) 
         },
        complete: () => { }
      })


    this.TotUsers = this.charts.usersTot

  }

  ngAfterViewInit(): void {


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


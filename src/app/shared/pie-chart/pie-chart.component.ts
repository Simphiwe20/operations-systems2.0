import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import * as Chartjs from "chart.js";
import { Chart } from 'chart.js';
import { timeout } from 'rxjs';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { ChartServicesService } from 'src/app/services/chart-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';



Chart.register(Chartjs.PieController)
Chart.register(...Chartjs.registerables)

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit, AfterViewChecked {

  public chart: any;
  @Input() user: any
  @Input() type: any

  other: number = 0;
  operationsCount: number = 0;
  salesCount: number = 0;
  makertingCount: number = 0;
  itCount: number = 0;
  users: any;
  currentUser: any;
  request: any[] = [];
  requestChartDatasets: any[] = []
  leavepieChartDatasets: any[] = []


  constructor(private charts: ChartServicesService, private api: ApiServicesService, private shared: SharedServicesService,
    private cdr: ChangeDetectorRef) {
    this.currentUser = this.shared.getData('session', 'user')

    this.request = ['/getGHRequests', '/getTransport', '/getTravel', '/getVisas']
    this.request.forEach(async (req: any) => {
      await this.charts.getReqs(this.currentUser, req)
    })

    this.charts.getLeavesNo(this.currentUser)

    setTimeout(() => {
      this.getReqs()
    }, 200)
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }
  
  public leavepieChartOptions: Chartjs.ChartOptions<'pie'> = {
    responsive: false,
  };
  public leavepieChartLabels = [['Pending'], ['Approved'], ['Declined']];

  public leavepieChartLegend = true;
  public leavepieChartPlugins = [];

  // Leaves Pie charts
  public requestpieChartOptions: Chartjs.ChartOptions<'pie'> = {
    responsive: false,
  };
  public requestspieChartLabels = [['GuestHouse'], ['Travel'], ['Transport'], ['Visa']];

  getReqs() {
    this.requestChartDatasets = [{
      data: [
        this.charts.guesthouseReq,
        this.charts.travelReq,
        this.charts.transportReq,
        this.charts.visaReq
      ]
    }];

    this.leavepieChartDatasets = [{
      data: [this.charts.pending, this.charts.approved, this.charts.declined]
    }];
  }

  public requestpieChartLegend = true;
  public requestpieChartPlugins = [];

  ngAfterViewInit(): void {
    this.DepChart()
    // this.charts.getLeavesNo(this.currentUser)
  }

  DepChart() {
    if (this.currentUser.role === 'admin') {
      this.api.genericGetAPI('/get-users')
        .subscribe({
          next: (res) => {
            this.users = res
            this.users.forEach((user: any, indx: number) => {
              if (user.department.toLowerCase() === 'it') this.itCount++
              else if (user.department.toLowerCase() === 'marketing') this.makertingCount++
              else if (user.department.toLowerCase() == 'sales') this.salesCount++
              else if (user.department.toLowerCase() === 'operations') this.operationsCount++
              else this.other++
            })


            let chartData: any = {
              data: [this.itCount, this.makertingCount, this.salesCount, this.operationsCount, this.other],
              label: ['IT', 'Marketing', 'Sales', 'Operations', 'Others'],
              backgroundColor: ['green', 'orange', 'blue', 'yellow', 'purple'],
              hoverOffset: 4,
              chartName: "usersChart"
            }

            this.getUserStatus(this.users)
            this.setChart(chartData)
          },
        })
    }
  }

  setChart(chartData: any) {
    let data = chartData.data
    let label = chartData.label
    let backgroundColor = chartData.backgroundColor
    let hoverOffset = chartData.hoverOffset
    let chartName = chartData.chartName

    this.chart = new Chart(chartName, {
      type: 'pie', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: [...label],
        datasets: [{
          // label: 'My First Dataset',
          data: [...data],
          backgroundColor: [...backgroundColor],
          hoverOffset: hoverOffset
        }],
      },
      options: {
        aspectRatio: 2.5,
        responsive: false
      }
    });
  }

  getUserStatus(users: any) {

    let disable = 0
    let active = 0
    users.forEach((user: any) => {
      if (user.status == 'active') {
        active++
      } else {
        disable++
      }
    })

    let chartData: any = {
      data: [active, disable],
      label: ['Active', 'Disable'],
      backgroundColor: ['green', 'grey'],
      hoverOffset: 2,
      chartName: "usersStatus"
    }

    this.setChart(chartData)
  }

}

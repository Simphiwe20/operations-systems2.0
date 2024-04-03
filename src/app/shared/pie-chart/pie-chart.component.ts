import { AfterViewInit, Component, Input } from '@angular/core';
import * as Chartjs from "chart.js";
import { Chart } from 'chart.js';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { ChartServicesService } from 'src/app/services/chart-services.service';



Chart.register(Chartjs.PieController)
Chart.register(...Chartjs.registerables)

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {

  public chart: any;
  @Input() user: any
  @Input() side: any

  other: number = 0; 
  operationsCount: number = 0;
  salesCount: number = 0;
  makertingCount: number = 0;
  itCount: number = 0;
  users: any;


  constructor(private charts: ChartServicesService, private api: ApiServicesService) {}


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

  // Leaves Pie charts
  public leavepieChartOptions: Chartjs.ChartOptions<'pie'> = {
    responsive: false,
  };
  public leavepieChartLabels = [['Pending'], ['Approved'],  ['Declined']];
  public leavepieChartDatasets = [{
    data: [, ]
  }];
  public leavepieChartLegend = true;
  public leavepieChartPlugins = [];

  ngAfterViewInit(): void {
    this.DepChart()  
    console.log('Ran')
  }

  DepChart() {

    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res) => {
          this.users = res
          this.users.forEach((user: any, indx: number) => {
            if(user.department.toLowerCase() === 'it') this.itCount++
            else if(user.department.toLowerCase() === 'marketing') this.makertingCount++
            else if(user.department.toLowerCase() == 'sales') this.salesCount++
            else if(user.department.toLowerCase() ==='operations') this.operationsCount++
            else this.other++
          })

          console.log(this.chart.data.datasets[0].data)
          this.chart.data.datasets[0].data.push(Number(this.itCount))
          this.chart.data.datasets[0].data.push(this.makertingCount)
          this.chart.data.datasets[0].data.push(this.salesCount)
          this.chart.data.datasets[0].data.push(this.operationsCount)
          this.chart.data.datasets[0].data.push(this.other)
          

        },
      })


    console.log(this.charts.itCount, this.charts.makertingCount, this.charts.salesCount, this.charts.operationsCount, this.charts.other)
    this.chart = new Chart("usersChart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['IT', 'Marketing', 'Sales', 'Operations', 'Others'],
        datasets: [{
          // label: 'My First Dataset',
          data: [],
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


}

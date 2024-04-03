import { Component, Input } from '@angular/core';
import * as Chartjs from "chart.js";

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss']
  })

export class LineGraphComponent {

  @Input() user: any;

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
}

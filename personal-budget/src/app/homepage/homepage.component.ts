import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Chart } from 'chart.js';
import { Chart } from 'chart.js/auto';
//import Chart from 'chart.js';
//import 'chartjs-plugin-datalabels'; // Import any additional plugins if needed

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public datasource = {
    datasets: [
      {
        data: [30, 40, 50],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
        ]
      }
    ],
    labels: ['Eat out',
      'Rent',
      'Groceries']
  };


  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget01')
      .subscribe((res: any) => {
        debugger;
        console.log(res);
        for (var i = 0; i < res.mybudget.length; i++) {
          this.datasource.datasets[0].data[i] = res.mybudget[i].budget;
          this.datasource.labels[i] = res.mybudget[i].title;
         this.createChart();

        }
        
      }
      );

  }
  createChart() {
    //var ctx = document.getElementById("myChart").getContext("2d") as HTMLImageElement;
    var ctx = document.getElementById("myChart") as HTMLCanvasElement;

    ctx.width = 450;
    ctx.height = 450;
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.datasource
    });

  }


}



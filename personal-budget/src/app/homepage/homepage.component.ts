import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Chart } from 'chart.js';
import { Chart, ChartOptions, ChartDataset } from 'chart.js/auto';
//import Chart from 'chart.js';
//import 'chartjs-plugin-datalabels'; // Import any additional plugins if needed

import * as d3 from 'd3';
import { PieArcDatum } from 'd3';

interface BudgetItem {
  title: string;
  budget: number;
}
import { DataService } from '../data.service';




@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

   public wid = 300;
   public hei = 300;
   public rad = Math.min(this.wid, this.hei) / 2;

  public datasource = {
    datasets: [
      {
        data: [30, 40, 90],
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

  myPieChart: Chart | undefined;
  d3Data: BudgetItem[] = [];
  re: any[] = [];


  constructor(private el: ElementRef, private http: HttpClient, private srv: DataService) {

  }
  ngOnInit(): void {
    this.srv.getData()
      .subscribe((res: any) => {
      
        console.log(res);
        for (var i = 0; i < res.mybudget.length; i++) {
          this.datasource.datasets[0].data[i] = res.mybudget[i].budget;
          this.datasource.labels[i] = res.mybudget[i].title;
      // this.createChart();
        //this.renderPieChart(this.wid, this.hei, this.rad);
        //this.createD3Chart();
        } 
        this.createChart();
        this.d3Data = res.mybudget;
        this.createD3Chart();
        //this.renderPieChart(this.wid, this.hei, this.rad);

      }
      );
  }


  renderPieChart(width: number, height: number, radius: number): void {
    const svg = d3
      //.select(this.el.nativeElement.querySelector('#pie-chart-container')) // Select the specified HTML element by ID
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie();
    debugger;
    const arcs = pie(this.datasource.datasets[0].data);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', (d: any) => arc(d) as string)
      .attr('fill', (d, i) => color(i.toString()));

    
  }

createChart() {
    //var ctx = document.getElementById("myChart").getContext("2d") as HTMLImageElement;
    var ctx = document.getElementById("myChart") as HTMLCanvasElement;

    ctx.width = 300;
    ctx.height = 300;

    if (this.myPieChart) {
      this.myPieChart.destroy();
    }

    this.myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.datasource,
      options: {
        responsive: false,
        maintainAspectRatio: false,
      } as ChartOptions
    });

  }
  createD3Chart(): void {
    const width = 300; // Set the desired width of the chart
    const height = 300; // Set the desired height of the chart
    const margin = 30;

     /* const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height); */

    const radius = Math.min(width, height) / 2 - margin;
    const svg = d3
    .select(this.chartContainer.nativeElement)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const data = this.d3Data;

  const color = d3.scaleOrdinal<string>()
    .domain(data.map(d => d.title))
    .range(d3.schemeDark2);

  const pie = d3.pie<BudgetItem>()
    .sort(null)
    .value(d => d.budget);

  const dataReady = pie(data);

  const arc = d3.arc<PieArcDatum<BudgetItem>>()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

  const outerArc = d3.arc<PieArcDatum<BudgetItem>>()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  svg.selectAll("allSlices")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("d", d => arc(d) as string)
    .attr("fill", d => color(d.data.title))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  svg.selectAll("allPolylines")
    .data(dataReady)
    .enter()
    .append("polyline")
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", d => {
      const posA = arc.centroid(d) as [number, number];
      const posB = outerArc.centroid(d) as [number, number];
      const posC = outerArc.centroid(d) as [number, number];
      const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
      return `${posA},${posB},${posC}`;
    });

  svg.selectAll("allLabels")
    .data(dataReady)
    .enter()
    .append("text")
    .text(d => d.data.title)
    .attr("transform", d => {
      const pos = outerArc.centroid(d) as [number, number];
      const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .style("text-anchor", d => {
      const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    });
}

ngOnDestroy(): void {
  if (this.myPieChart) {
    this.myPieChart.destroy();
  }
}
  

 /*/new code
 private createSvg(): void {
  this.svg = d3.select(this.chartContainer.nativeElement)
  .append("svg")
  .attr("width", this.width)
  .attr("height", this.height)
  .append("g")
  .attr(
    "transform",
    "translate(" + this.width / 2 + "," + this.height / 2 + ")"
  );
}
private createColors(): void {
  this.colors = d3.scaleOrdinal()
  .domain(this.data.map(d => d.budget.toString()))
  .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
}
private drawChart(): void {
  
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.budget));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d: any, i: any) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('text')
  .text((d: any)=> d.data.title)
  .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}
 //new code */

}



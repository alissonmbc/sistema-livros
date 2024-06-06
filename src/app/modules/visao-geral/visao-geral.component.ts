import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { BookService } from 'src/app/shared/services/book.service';

import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-visao-geral',
    templateUrl: './visao-geral.component.html',
    styleUrls: ['./visao-geral.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class VisaoGeralComponent implements OnInit {
    highcharts = Highcharts;
    chartOptions = [];
    mapa = false;

    constructor(private bookService: BookService) { }

    ngOnInit() {
      this.bookService.data$.subscribe(res => {
        if (res) {
          this.bookService.getTrendsHP().subscribe(data => {
            this.chartOptions = [];
            const series = [];
            const categories = [];
            data.interest_over_time.timeline_data.forEach(element => {
              series.push(element.values[0].extracted_value);
              categories.push(element.date);
            });
            this.chartOptions.push({
              chart: {
                type: 'line',
              },
              title: {
                text: 'Interesse no último ano - Título',
              },
              subtitle: {
                text: 'Fonte: Google Trends',
              },
              yAxis: {
                title: {
                  text: 'Valores',
                },
              },
              xAxis: {
                categories,
              },
              plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true,
                  },
                  enableMouseTracking: false,
                },
              },
              series: [
                {
                  name: res.volumeInfo.title,
                  color: '#00d68f',
                  data: series,
                },
              ],
            });
            this.bookService.getTrendsJK().subscribe( data2 => {
              const series2 = [];
              data2.interest_over_time.timeline_data.forEach(element => {
                series2.push(element.values[0].extracted_value);
              });
              this.chartOptions.push({
                chart: {
                  type: 'line',
                },
                title: {
                  text: 'Interesse no último ano - Autores',
                },
                subtitle: {
                  text: 'Fonte: Google Trends',
                },
                yAxis: {
                  title: {
                    text: 'Valores',
                  },
                },
                xAxis: {
                  categories,
                },
                plotOptions: {
                  line: {
                    dataLabels: {
                      enabled: true,
                    },
                    enableMouseTracking: false,
                  },
                },
                series: [
                  {
                    name: res.volumeInfo.authors[0],
                    color: '#00d68f',
                    data: series2,
                  },
                ],
              });
            });
          });
        }
      });
    }

    tab(): void {
      this.mapa = !this.mapa;
    }

}

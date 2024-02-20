import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
    gridAvailable = false;

    gridOptions = {
        columnDefs: [
            {headerName: 'Região', field: 'regiao', minWidth: 450},
            {headerName: 'Ápice de Interesse', field: 'apice', minWidth: 450}
        ],
        rowData: []
    };

    constructor(private bookService: BookService,
                private http: HttpClient) { }

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
            this.gridOptions.rowData = [];
            for (let i = 0; i < 10; i++) {
              if (data.interest_by_region.length > 0) {
                this.gridOptions.rowData.push({regiao: data.interest_by_region[i].location, apice: data.interest_by_region[i].extracted_value});
              }
            }
            this.gridAvailable = true;
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

}

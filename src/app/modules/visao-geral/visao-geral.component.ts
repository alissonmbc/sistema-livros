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
          this.http.get<any>('http://localhost:3000/interestOverTime/' + res.volumeInfo.title).pipe(map( data => {
            return data;
          })).subscribe(data => {
            this.chartOptions = [];
            const series = [];
            const categories = [];
            data.default.timelineData.forEach(element => {
              series.push(element.value[0]);
              categories.push(element.formattedAxisTime);
            });
            this.chartOptions.push({
              chart: {
                type: 'line',
              },
              title: {
                text: 'Interesse através do Tempo - Título',
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
            this.http.get<any>('http://localhost:3000/interestOverTime/' + res.volumeInfo.authors[0]).pipe(map( interest => {
              return interest;
            })).subscribe( data2 => {
              const series2 = [];
              const categories2 = [];
              data2.default.timelineData.forEach(element => {
                series2.push(element.value[0]);
                categories2.push(element.formattedAxisTime);
              });
              this.chartOptions.push({
                chart: {
                  type: 'line',
                },
                title: {
                  text: 'Interesse através do Tempo - Autores',
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
                  categories2,
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
          this.http.get<any>('http://localhost:3000/interestByRegion/' + res.volumeInfo.title).pipe(map( data => {
            return data;
          })).subscribe( data => {
            this.gridOptions.rowData = [];
            for (let i = 0; i < 10; i++) {
              if (data.default.geoMapData[i] && data.default.geoMapData[i].value[0] > 0) {
                this.gridOptions.rowData.push({regiao: data.default.geoMapData[i].geoName, apice: data.default.geoMapData[i].value[0]});
              }
            }
            this.gridAvailable = true;
          });
        }
      });
    }

}

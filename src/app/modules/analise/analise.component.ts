import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { BookService } from 'src/app/shared/services/book.service';

import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-analise',
    templateUrl: './analise.component.html',
    styleUrls: ['./analise.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class AnaliseComponent {
    form;
    highcharts = Highcharts;
    chartOptions = [];
    carregando = false;
    titulo1 = '';
    titulo2 = '';

    gridOptions1 = {
        columnDefs: [
            {headerName: 'Região', field: 'regiao', minWidth: 120},
            {headerName: 'Ápice de Interesse', field: 'apice', minWidth: 120}
        ],
        rowData: []
    };

    gridOptions2 = {
      columnDefs: [
          {headerName: 'Região', field: 'regiao', minWidth: 120},
          {headerName: 'Ápice de Interesse', field: 'apice', minWidth: 120}
      ],
      rowData: []
  };

    constructor(private formBuilder: FormBuilder,
                private http: HttpClient,
                private bookService: BookService) {
      this.form = this.formBuilder.group({
        texto: ''
      });
    }

    onSubmit(data) {
      if (data.texto && data.texto !== '') {
        this.carregando = true;
        this.chartOptions = [];
        const series2 = [];
        this.bookService.data$.subscribe(res => {
          if (res) {
            this.http.get<any>('http://localhost:3000/interestOverTime/' + res.volumeInfo.title).pipe(map( interest => {
              return interest;
            })).subscribe(data2 => {
              data2.default.timelineData.forEach(element => {
                series2.push(element.value[0]);
              });
              this.titulo1 = res.volumeInfo.title;
            });
          }
          this.http.get<any>('http://localhost:3000/interestByRegion/' + res.volumeInfo.title).pipe(map( interest2 => {
            return interest2;
          })).subscribe(data3 => {
            this.gridOptions1.rowData = [];
            for (let i = 0; i < 10; i++) {
              if (data3.default.geoMapData[i] && data3.default.geoMapData[i].value[0] > 0) {
                this.gridOptions1.rowData.push({regiao: data3.default.geoMapData[i].geoName, apice: data3.default.geoMapData[i].value[0]});
              }
            }
          });
        });
        this.bookService.search(data.texto).subscribe(res => {
          if (res) {
              this.titulo2 = res[0].volumeInfo.title;
              this.http.get<any>('http://localhost:3000/interestOverTime/' + res[0].volumeInfo.title).pipe(map( interest3 => {
                return interest3;
              })).subscribe(data4 => {
                const series = [];
                const categories = [];
                data4.default.timelineData.forEach(element => {
                  series.push(element.value[0]);
                  categories.push(element.formattedAxisTime);
                });
                this.chartOptions.push({
                  chart: {
                    type: 'line',
                  },
                  title: {
                    text: 'Interesse através do Tempo',
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
                      name: this.titulo1,
                      color: '#00d68f',
                      data: series2,
                    },
                    {
                      name: res[0].volumeInfo.title,
                      color: '#ff0000',
                      data: series,
                    },
                  ],
                });
              });
              this.http.get<any>('http://localhost:3000/interestByRegion/' + res[0].volumeInfo.title).pipe(map( interest4 => {
                return interest4;
              })).subscribe(data5 => {
                this.gridOptions2.rowData = [];
                for (let i = 0; i < 10; i++) {
                  if (data5.default.geoMapData[i] && data5.default.geoMapData[i].value[0] > 0) {
                    this.gridOptions2.rowData.push({regiao: data5.default.geoMapData[i].geoName, apice: data5.default.geoMapData[i].value[0]});
                  }
                }
              });
              this.carregando = false;
          }
        });
      }
    }
  }

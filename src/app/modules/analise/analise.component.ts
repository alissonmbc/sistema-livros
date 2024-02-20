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
            this.bookService.getTrendsHP().subscribe(data2 => {
              data2.interest_over_time.timeline_data.forEach(element => {
                series2.push(element.values[0].extracted_value);
              });
              this.titulo1 = res.volumeInfo.title;
              this.gridOptions1.rowData = [];
              for (let i = 0; i < 10; i++) {
                if (data2.interest_by_region.length > 0) {
                  this.gridOptions1.rowData.push({regiao: data2.interest_by_region[i]?.location, apice: data2.interest_by_region[i]?.extracted_value});
                }
              }
            });
          }
        });
        this.bookService.search(data.texto).subscribe(res => {
          if (res) {
              this.titulo2 = res[0].volumeInfo.title;
              this.bookService.getTrendsLOTR().subscribe(data4 => {
                const series = [];
                const categories = [];
                data4.interest_over_time.timeline_data.forEach(element => {
                  series.push(element.values[0].extracted_value);
                  categories.push(element.date);
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
                this.gridOptions2.rowData = [];
                for (let i = 0; i < 10; i++) {
                  if (data4.interest_by_region[i]) {
                    this.gridOptions2.rowData.push({regiao: data4.interest_by_region[i].location, apice: data4.interest_by_region[i].extracted_value});
                  }
                }
              });
              this.carregando = false;
          }
        });
      }
    }
  }

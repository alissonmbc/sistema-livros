import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Book } from 'src/app/shared/models/books';
import { BookService } from 'src/app/shared/services/book.service'

import * as Highcharts from "highcharts";

@Component({
    selector: 'app-analise',
    templateUrl: './analise.component.html',
    styleUrls: ['./analise.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class AnaliseComponent implements OnInit {
    form;
    highcharts = Highcharts;
    private API = 'https://www.googleapis.com/books/v1/volumes';
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

    ngOnInit() {
    }

    onSubmit(data) {
      if(data.texto && data.texto !== '') {
        this.carregando = true;
        this.chartOptions = [];
        var series2 = [];
        this.bookService.data$.subscribe(res => {
          if(res) {
            this.http.get<any>('http://localhost:3000/interestOverTime/' + res.volumeInfo.title).pipe(map( data => {
              return data;
            })).subscribe(data => {
              data.default.timelineData.forEach(element => {
                series2.push(element.value[0]);
              });
              this.titulo1 = res.volumeInfo.title;
            });
          }
          this.http.get<any>('http://localhost:3000/interestByRegion/' + res.volumeInfo.title).pipe(map( data => {
            return data;
          })).subscribe(data => {
            this.gridOptions1.rowData = [];
            for(let i = 0;i<10;i++) {
              if (data.default.geoMapData[i] && data.default.geoMapData[i].value[0] > 0)
                this.gridOptions1.rowData.push({regiao: data.default.geoMapData[i].geoName, apice: data.default.geoMapData[i].value[0]});
            }
          });
        });
        this.search(data.texto).subscribe(res => {
          if(res) {
              this.titulo2 = res[0].volumeInfo.title;
              this.http.get<any>('http://localhost:3000/interestOverTime/' + res[0].volumeInfo.title).pipe(map( data => {
                return data;
              })).subscribe(data => {
                var series = [];
                var categories = [];
                data.default.timelineData.forEach(element => {
                  series.push(element.value[0]);
                  categories.push(element.formattedAxisTime);
                });
                this.chartOptions.push({
                  chart: {
                    type: "line",
                  },
                  title: {
                    text: "Interesse através do Tempo",
                  },
                  subtitle: {
                    text: "Fonte: Google Trends",
                  },
                  yAxis: {
                    title: {
                      text: "Valores",
                    },
                  },
                  xAxis: {
                    categories: categories,
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
                      color: "#00d68f",
                      data: series2,
                    },
                    {
                      name: res[0].volumeInfo.title,
                      color: "#ff0000",
                      data: series,
                    },
                  ],
                });
              });
              this.http.get<any>('http://localhost:3000/interestByRegion/' + res[0].volumeInfo.title).pipe(map( data => {
                return data;
              })).subscribe(data => {
                this.gridOptions2.rowData = [];
                for(let i = 0;i<10;i++) {
                  if (data.default.geoMapData[i] && data.default.geoMapData[i].value[0] > 0)
                    this.gridOptions2.rowData.push({regiao: data.default.geoMapData[i].geoName, apice: data.default.geoMapData[i].value[0]});
                }
              });
              this.carregando = false;
          }
        });
      }
    }

    private search(query: string): Observable<Book[]> {
      return this.http
       .get<{ items: Book[] }>(`${this.API}?q=${query}`)
       .pipe(map(books => books.items || []));
    }
  }
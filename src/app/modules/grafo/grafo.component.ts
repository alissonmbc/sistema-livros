import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Highcharts from 'highcharts';
require('highcharts/modules/networkgraph')(Highcharts);

import { BookService } from 'src/app/shared/services/book.service';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-grafo',
    templateUrl: './grafo.component.html',
    styleUrls: ['./grafo.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class GrafoComponent implements OnInit {
    highcharts = Highcharts;
    chartOptions = [];

    constructor(private bookService: BookService, private http: HttpClient) { }

    ngOnInit() {
      this.bookService.data$.subscribe(res => {
        if (res) {
          const links = [];
          this.http.get<any>('http://localhost:3000/relatedTopics/' + res.volumeInfo.title).pipe(map( data => {
            return data;
          })).subscribe(data => {
            data.default.rankedList[0].rankedKeyword.forEach(element => {
              if (element.value > 0) {
                links.push([res.volumeInfo.title, element.topic.title + ' - ' + element.topic.type]);
              }
            });
            this.chartOptions.push({
              chart: {
                type: 'networkgraph',
              },
              title: {
                text: 'Tópicos Relacionados',
              },
              subtitle: {
                text: 'Fonte: Google Trends',
              },
              plotOptions: {
                networkgraph: {
                  layoutAlgorithm: {
                      linkLength: 50
                  },
                  link: {
                      color: '#00d68f'
                  }
                }
              },
              series: [
                {
                  data: links,
                },
              ],
            });
            this.http.get<any>('http://localhost:3000/relatedQueries/' + res.volumeInfo.title).pipe(map( queries => {
              return queries;
            })).subscribe(data2 => {
              const links2 = [];
              data2.default.rankedList[0].rankedKeyword.forEach(element => {
                if (element.value > 0) {
                  links2.push([res.volumeInfo.title, element.query]);
                }
              });
              this.chartOptions.push({
                chart: {
                  type: 'networkgraph',
                },
                title: {
                  text: 'Termos de Pesquisa Relacionados',
                },
                subtitle: {
                  text: 'Fonte: Google Trends',
                },
                plotOptions: {
                  networkgraph: {
                    layoutAlgorithm: {
                        linkLength: 50
                    },
                    link: {
                        color: '#00d68f'
                    }
                  }
                },
                series: [
                  {
                    data: links2,
                  },
                ],
              });
            });
          });
        }
      });
    }
}

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
          this.bookService.getTrendsHP().subscribe(data => {
            data.related_topics.top.forEach(element => {
              console.log(element.topic)
              if(element.topic.type.toLowerCase().includes(`book`) || element.topic.type.toLowerCase().includes(`novel`)) {
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
          });
        }
      });
    }
}

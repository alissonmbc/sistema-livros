import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/shared/services/book.service';
import Highcharts from "highcharts/highmaps";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  highcharts = Highcharts;
  chartOptions = null;
  chartConstructor = 'mapChart';

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getTrendsHP().subscribe((value) => {
      console.log(worldMap);
      const data = [];
      worldMap.features.forEach(feature => {
        const id = value.interest_by_region.find(interest => interest.geo.toLowerCase() === feature.id.toLowerCase())?.value || 0;
        data.push([feature.id.toLowerCase(), Number(id)]);
      });
      this.chartOptions = {
        chart: {
          map: worldMap,
        },
        title: {
          text: 'Interesse percentual por país',
        },
        subtitle: {
          text: 'Fonte: <a href="https://trends.google.com.br/trends/">Google Trends</a>',
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            alignTo: 'spacingBox',
          },
        },
        legend: {
          enabled: true,
        },
        colorAxis: {
          min: 0,
          maxColor: '#00d68f'
        },
        series: [
          {
            type: 'map',
            name: 'Interesse nessa região',
            states: {
              hover: {
                color: '#00d68f',
              },
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}',
            },
            allAreas: false,
            data
          },
        ],
      };
    });
  }
}

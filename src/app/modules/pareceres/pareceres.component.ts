import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';

import { BookService } from 'src/app/shared/services/book.service';

@Component({
    selector: 'app-pareceres',
    templateUrl: './pareceres.component.html',
    styleUrls: ['./pareceres.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class PareceresComponent implements OnInit {
    parecer = '';
    escrevendo = false;
    parecerExibido = '';

    gridOptions = {
        columnDefs: [
          {headerName: 'Autor', field: 'autor', minWidth: 350},
          {headerName: 'Avaliado em', field: 'avaliado_em', minWidth: 350}
        ],
        rowData: []
    };

    constructor(private bookService: BookService) { }

    ngOnInit() {
      this.bookService.getParecer().subscribe(res => {
        if (res) {
          this.gridOptions.rowData = res;
        }
      });
    }

    onRowClicked(params) {
      this.parecerExibido = params.data.texto;
    }

    exibirAreaTexto() {
      this.escrevendo = !this.escrevendo;
    }

    salvarTexto() {
      const parecer = {
        texto: this.parecer,
        autor: this.bookService.getName(),
        avaliado_em: moment(new Date()).utc().format('DD/MM/YYYY')
      };
      let identifier = '';
      this.bookService.data$.subscribe(res => {
        identifier = res.volumeInfo.industryIdentifiers[0].identifier;
      });
      this.gridOptions.rowData.push(parecer);
      this.bookService.postParecer(this.gridOptions.rowData, identifier);
      this.exibirAreaTexto();
      this.parecer = '';
    }
}

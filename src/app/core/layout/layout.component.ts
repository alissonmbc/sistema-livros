import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';

import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { BookService } from 'src/app/shared/services/book.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class LayoutComponent implements OnInit {
    livroSelecionado = null;
    spinner = true;
    autores = '';
    valor = '';
    nomeUsuario = '';

    static dia = 1000 * 60 * 60 * 24;

    menuItems: any = [{title: 'Interesse', link: '/interesse/', icon: 'globe-outline'},
    {title: 'Tópicos Relacionados', link: '/topicos-relacionados/', icon: 'pantone-outline'},
    {title: 'Mapa', link: '/mapa/', icon: 'map-outline'},
    {title: 'Análise', link: '/analise/', icon: 'message-square-outline'},
    {title: 'Sair', link: '/logout', icon: 'log-out-outline'}];

    form;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private bookService: BookService) {
        this.form = this.formBuilder.group({
          texto: ''
        });
       }

    ngOnInit() {
      if(!localStorage.getItem(`user`) || (Date.now() - Number(localStorage.getItem(`expiration`))) > LayoutComponent.dia) {
        this.bookService.logout();
      }
      this.bookService.data$.subscribe(res => {
        this.spinner = true;
        this.livroSelecionado = res;
        if (res) {
          if (this.livroSelecionado.saleInfo.listPrice) {
            const currencyPipe: CurrencyPipe = new CurrencyPipe('pt-BR');
            this.valor = currencyPipe.transform(this.livroSelecionado.saleInfo.listPrice.amount, 'BRL');
          }
          this.autores = '';
          this.livroSelecionado.volumeInfo.authors.forEach(element => {
            this.autores += element + '; ';
          });
          this.menuItems.forEach(element => {
            if (!element.link.endsWith('logout')) {
              const url = element.link.split('/')[1];
              element.link = '/' + url + '/' + this.livroSelecionado.volumeInfo.industryIdentifiers[0].identifier;
            }
          });
        }
        setTimeout(() => {
          this.spinner = false;
        }, 500);
      });
      this.nomeUsuario = this.bookService.getName(localStorage.getItem(`user`));
    }

    onSubmit(data) {
      this.form.reset();
      this.bookService.changeUrl(data.texto);
      this.router.navigate(['/pesquisa/' + data.texto]);
    }

    abrirWebReader() {
      window.open(this.livroSelecionado.accessInfo.webReaderLink, '_blank');
    }

    abrirPlayStore() {
      window.open(this.livroSelecionado.saleInfo.buyLink, '_blank');
    }
}

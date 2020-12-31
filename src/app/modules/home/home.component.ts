import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Book } from 'src/app/shared/models/books';
import { BookService } from 'src/app/shared/services/book.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class HomeComponent implements OnInit {
    private API = 'https://www.googleapis.com/books/v1/volumes';

    gridAvailable = false;

    gridOptions = {
        columnDefs: [
            {headerName: 'Título', field: 'titulo', minWidth: 300},
            {headerName: 'Autores', field: 'autores', minWidth: 300},
            {headerName: 'Identificador', field: 'isbn', minWidth: 300}
        ],
        rowData: []
    };

    books = [];
  
    constructor(private http: HttpClient,
        private bookService: BookService) { }

    ngOnInit() {
        this.bookService.url$.subscribe(keyword => {
            if(keyword && keyword !== '') {
                this.search(keyword).subscribe(res => {
                    if(res) {
                        this.gridOptions.rowData = [];
                        this.books = [];
                        this.gridAvailable = false;
                        for(let item of res) {
                            let autores = '';
                            if(this.isIterable(item.volumeInfo.authors)) {
                                for(let autor of item.volumeInfo.authors) {
                                    autores += autor + '; ';
                                } 
                            }
                            let identifier;
                            item.volumeInfo.industryIdentifiers ? identifier = item.volumeInfo.industryIdentifiers[0].identifier : identifier = '';
                            if(autores !== '' && identifier !== '') {
                                this.gridOptions.rowData.push({titulo: item.volumeInfo.title, autores: autores, isbn: identifier});
                                this.books.push(item);
                            }
                        }
                        if(this.books.length>0)
                            this.bookService.changeData(this.books[0]);
                        this.gridAvailable = true;
                    }
                });
            }
        });
    }

    private search(query: string): Observable<Book[]> {
      return this.http
       .get<{ items: Book[] }>(`${this.API}?q=${query}`)
       .pipe(map(books => books.items || []));
    }

    isIterable(obj) {
      if (obj == null) {
        return false;
      }
      return typeof obj[Symbol.iterator] === 'function';
    }

    onRowClicked(obj) {
        this.bookService.changeData(this.books.find(book => book.volumeInfo.industryIdentifiers[0].identifier === obj.data.isbn));
    }

}
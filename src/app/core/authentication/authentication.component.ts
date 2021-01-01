import { Component, ViewEncapsulation } from '@angular/core';

import { BookService } from 'src/app/shared/services/book.service';

@Component({
  selector: 'app-login',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthenticationComponent {
  mensagem = '';

  constructor(private bookService: BookService) {}

  login() {
   this.bookService.login();
  }
}

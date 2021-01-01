import { Component, ViewEncapsulation } from '@angular/core';
import { BookService } from 'src/app/shared/services/book.service';

@Component({
  selector: 'app-logout',
  template: '',
  encapsulation: ViewEncapsulation.None
})
export class LogoutServiceComponent {
  constructor(private bookService: BookService) {
    this.bookService.logout();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/books'
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from '@angular/router';

@Injectable()
export class BookService {
  private user: any;

  private data = new BehaviorSubject(null);
  data$ = this.data.asObservable();

  private url = new BehaviorSubject('');
  url$ = this.url.asObservable();

  constructor(private auth: AngularFireAuth, private router: Router) {}

  changeData(data: Book) {
    this.data.next(data);
  }

  changeUrl(url: string) {
    this.url.next(url);
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((user) => {
      this.user = user;
      this.router.navigate(["pesquisa/livro"], { replaceUrl: true });
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(["login"], { replaceUrl: true });
    });
  }

  getName() {
    if(this.user)
      return this.user.user.displayName;
    else
      this.logout(); 
  }
}
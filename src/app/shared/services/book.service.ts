import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../models/books';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase/app';
import { Router } from '@angular/router';

@Injectable()
export class BookService {
  private API = 'https://www.googleapis.com/books/v1/volumes';
  private dbAccess: Observable<any>;
  private user: any;

  private data = new BehaviorSubject(null);
  data$ = this.data.asObservable();

  private url = new BehaviorSubject('');
  url$ = this.url.asObservable();

  constructor(private http: HttpClient, private auth: AngularFireAuth, private database: AngularFireDatabase, private router: Router) { }

  changeData(data: Book) {
    this.dbAccess = this.database.object(data.volumeInfo.industryIdentifiers[0].identifier).valueChanges();
    this.data.next(data);
  }

  changeUrl(url: string) {
    this.url.next(url);
  }

  search(query: string): Observable<Book[]> {
    return this.http
     .get<{ items: Book[] }>(`${this.API}?q=${query}`)
     .pipe(map(books => (books.items || [])));
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((user) => {
      this.user = user;
      this.router.navigate(['pesquisa/livro'], { replaceUrl: true });
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login'], { replaceUrl: true });
    });
  }

  getName() {
    if (this.user) {
      return this.user.user.displayName;
    }
    else {
      this.logout();
    }
  }

  getParecer(): Observable<any> {
    return this.dbAccess.pipe(map(res => {
      return res;
    }));
  }

  postParecer(data: any, id: string) {
    const dbRef = this.database.object(id);
    dbRef.set(data);
  }
}

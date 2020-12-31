import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {registerLocaleData} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LayoutComponent} from './core/layout/layout.component';
import {AuthenticationComponent} from './core/authentication/authentication.component';
import { LogoutServiceComponent } from './core/authentication/logout.service';

import {HomeComponent} from './modules/home/home.component';
import { VisaoGeralComponent } from './modules/visao-geral/visao-geral.component';
import { GrafoComponent } from './modules/grafo/grafo.component';
import { AnaliseComponent } from './modules/analise/analise.component';
import { PareceresComponent } from './modules/pareceres/pareceres.component';

import {BookService} from './shared/services/book.service';

import { NbThemeModule, NbLayoutModule, NbIconModule, NbMenuModule, NbButtonModule, NbCardModule, NbSpinnerModule, NbTabsetModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import {AgGridModule} from "ag-grid-angular";
import {HighchartsChartModule} from 'highcharts-angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

registerLocaleData(localePt, 'pt-BR');

const config = {
  apiKey: "AIzaSyAmmRlJ-GGjKS17viQf9zwBzf7izAyUWL8",
  authDomain: "bookfinder-6ee00.firebaseapp.com",
  databaseURL: "https://bookfinder-6ee00-default-rtdb.firebaseio.com/",
  storageBucket: "bookfinder-6ee00.appspot.com",
  messagingSenderId: "470251622623"
};

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    AuthenticationComponent,
    LogoutServiceComponent,
    HomeComponent,
    VisaoGeralComponent,
    GrafoComponent,
    AnaliseComponent,
    PareceresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbIconModule,
    NbEvaIconsModule,
    NbMenuModule.forRoot(),
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbTabsetModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    HighchartsChartModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule
  ],
  providers: [BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }

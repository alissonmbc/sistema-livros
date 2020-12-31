import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './core/layout/layout.component';
import { AuthenticationComponent } from './core/authentication/authentication.component';
import { LogoutServiceComponent } from './core/authentication/logout.service';

import { HomeComponent } from './modules/home/home.component';
import { VisaoGeralComponent } from './modules/visao-geral/visao-geral.component';
import { GrafoComponent } from './modules/grafo/grafo.component';
import { AnaliseComponent } from './modules/analise/analise.component';
import { PareceresComponent } from './modules/pareceres/pareceres.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: AuthenticationComponent},
  {path: 'logout', component: LogoutServiceComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'pesquisa/:keyword', component: HomeComponent },
    { path: 'visao-geral/:identifier', component: VisaoGeralComponent },
    { path: 'grafo/:identifier', component: GrafoComponent },
    { path: 'analise/:identifier', component: AnaliseComponent },
    { path: 'pareceres/:identifier', component: PareceresComponent }],
    runGuardsAndResolvers: 'always',
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Usuarios } from './pages/usuarios/usuarios';
import { MainLayout } from './components/main-layout/main-layout';
import { ListaOrdemCompra } from './pages/ordem-compra/lista-ordem-compra/lista-ordem-compra';
import { ConsultaEstoque } from './pages/materiais/consulta-estoque/consulta-estoque';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component:MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'usuarios', component: Usuarios },
      { path: 'materiais', component: ConsultaEstoque },
      {path:'ordens-compra',component:ListaOrdemCompra}
    ],
  },
];

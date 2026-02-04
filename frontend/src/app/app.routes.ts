import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // raiz "/"
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    title: 'Log in | Authentication System',
  },
  {
    path: '**', // rota de erro
    loadComponent: () => import('./features/error/error-page/error-page').then((m) => m.ErrorPage),
    title: 'Oops!',
  },
];

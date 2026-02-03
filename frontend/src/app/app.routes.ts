import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // raiz "/"
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    title: 'Log in | Authentication System',
  },
];

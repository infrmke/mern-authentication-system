import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // raiz "/"
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    title: 'Log in | Authentication System',
  },
  {
    path: 'register', // cadastro
    loadComponent: () => import('./features/auth/sign-up/sign-up').then((m) => m.SignUp),
    title: 'Register | Authentication System',
  },
  {
    path: 'forgot-password', // esqueceu a senha
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: '**', // rota de erro
    loadComponent: () => import('./features/error/error-page/error-page').then((m) => m.ErrorPage),
    title: 'Oops!',
  },
];

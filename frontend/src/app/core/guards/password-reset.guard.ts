import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserService } from '../services/user-service';

const passwordResetGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.userData();
  const resetEmail = userService.resetEmail();

  // usuários logados NÃO acessam o fluxo de forgot-password
  if (user) {
    router.navigate(['/home']);
    return false;
  }

  const currentPath = state.url;

  // se o dado "email" estiver no state, o usuário pode ir para a página de reset
  if (
    resetEmail &&
    (currentPath === '/forgot-password' || currentPath === '/forgot-password/verify')
  ) {
    // o back-end irá validar se o cookie passwordToken existe/é válido
    router.navigate(['/forgot-password/reset']);
    return false;
  }

  // proteção para a página de redefinição de senha
  if (currentPath === '/forgot-password/reset' && !resetEmail) {
    router.navigate(['/forgot-password']);
    return false;
  }

  return true;
};

export default passwordResetGuard;

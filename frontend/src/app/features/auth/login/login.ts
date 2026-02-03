import { Component } from '@angular/core';

import { LayoutCard } from '../../../shared/components/layout-card/layout-card';
import { InputGroup } from '../../../shared/components/input-group/input-group';
import { RedirectAction } from '../../../shared/components/redirect-action/redirect-action';

@Component({
  selector: 'app-login',
  imports: [LayoutCard, InputGroup, RedirectAction],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  onLoginSubmit(): void {
    console.log('Enviado.');
  }
}

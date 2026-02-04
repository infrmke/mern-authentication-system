import { Component } from '@angular/core';

import { CardBody } from '../../../shared/components/card-body/card-body';
import { InputGroup } from '../../../shared/components/input-group/input-group';
import { RedirectAction } from '../../../shared/components/redirect-action/redirect-action';

@Component({
  selector: 'app-login',
  imports: [CardBody, InputGroup, RedirectAction],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  onLoginSubmit(): void {
    console.log('Enviado.');
  }
}

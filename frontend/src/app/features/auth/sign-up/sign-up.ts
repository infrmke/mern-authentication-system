import { Component } from '@angular/core';

import { CardBody } from '../../../shared/components/card-body/card-body';
import { InputGroup } from '../../../shared/components/input-group/input-group';
import { RedirectAction } from '../../../shared/components/redirect-action/redirect-action';

@Component({
  selector: 'app-sign-up',
  imports: [CardBody, InputGroup, RedirectAction],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  onRegisterSubmit(): void {
    console.log('Enviado.');
  }
}

import { Component } from '@angular/core';

import { CardBody } from '../../../shared/components/card-body/card-body';
import { InputGroup } from '../../../shared/components/input-group/input-group';

@Component({
  selector: 'app-forgot-password',
  imports: [CardBody, InputGroup],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  onForgotSubmit(): void {
    console.log('Enviado.');
  }
}

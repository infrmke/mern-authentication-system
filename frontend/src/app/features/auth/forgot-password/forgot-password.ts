import { Component } from '@angular/core';

import { LayoutCard } from '../../../shared/components/layout-card/layout-card';
import { InputGroup } from '../../../shared/components/input-group/input-group';

@Component({
  selector: 'app-forgot-password',
  imports: [LayoutCard, InputGroup],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  onForgotSubmit(): void {
    console.log('Enviado.');
  }
}

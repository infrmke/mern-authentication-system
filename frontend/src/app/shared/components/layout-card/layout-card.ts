import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layout-card',
  imports: [],
  templateUrl: './layout-card.html',
  styleUrl: './layout-card.scss',
})
export class LayoutCard {
  @Input() title: string = '';
  @Input() buttonText: string = '';

  onSubmit() {
    console.log('Enviado.');
  }
}

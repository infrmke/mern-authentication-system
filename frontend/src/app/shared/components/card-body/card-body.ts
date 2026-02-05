import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-body',
  imports: [],
  templateUrl: './card-body.html',
  styleUrl: './card-body.scss',
})
export class CardBody {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = '';
}

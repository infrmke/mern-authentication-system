import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-input-group',
  imports: [LucideAngularModule],
  templateUrl: './input-group.html',
  styleUrl: './input-group.scss',
})
export class InputGroup {
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() iconName?: string; // nome do ícone no pacote lucide
  @Input() required: boolean = false;
  @Input() autoFocus: boolean = false;
}

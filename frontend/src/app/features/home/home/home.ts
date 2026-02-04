import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../../shared/components/navbar/navbar';
import { UserSection } from '../../../shared/components/user-section/user-section';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-home',
  imports: [Navbar, UserSection, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  userService = inject(UserService);

  handleClickDelete() {
    if (
      confirm(
        'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
      )
    ) {
      // lógica da api aqui...
      console.log('Excluido!');
    }
  }
}

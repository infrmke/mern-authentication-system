import { Component, inject } from '@angular/core';
import { Menu } from '../menu/menu';
import { UserService } from '../../../core/services/user-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Menu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  userService = inject(UserService);

  async handleClickLogOut() {
    // lógica da api aqui...
    this.userService.setUserData(null);
  }
}

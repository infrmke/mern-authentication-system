import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth-service';
import { UserService } from './core/services/user-service';
import { PulseLoader } from './shared/components/loaders/pulse-loader/pulse-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PulseLoader],
  styleUrl: './app.scss',
  template: `
    @if (isReady()) {
      <router-outlet></router-outlet>
    } @else {
      <app-pulse-loader></app-pulse-loader>
    }
  `,
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  isReady = signal(false);

  // verifica se o usuário já está logado na inicialização do app
  ngOnInit() {
    this.authService.verifySession().subscribe({
      next: (user) => {
        this.userService.setUserData(user);
        this.isReady.set(true);
      },
      error: () => {
        this.userService.clearUser();
        this.isReady.set(true);
      },
    });
  }
}

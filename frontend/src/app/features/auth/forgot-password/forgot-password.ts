import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CardBody } from '../../../shared/components/card-body/card-body';
import { InputGroup } from '../../../shared/components/input-group/input-group';
import { AuthService } from '../../../core/services/auth-service';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-forgot-password',
  imports: [CardBody, InputGroup, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  isLoading = signal(false);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onForgotSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.getRawValue().email;

    this.isLoading.set(true);

    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.userService.setResetEmail(email); // guarda o email no state definido no UserService
        this.router.navigate(['/verify-otp']); // navega para a próxima rota
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.error?.message || "Something didn't work! Try again.");
      },
      complete: () => this.isLoading.set(false),
    });
  }
}

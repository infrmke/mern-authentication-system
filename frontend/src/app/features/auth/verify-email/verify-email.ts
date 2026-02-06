import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';
import { UserService } from '../../../core/services/user-service';

import { CardBody } from '../../../shared/components/card-body/card-body';
import { OtpInput } from '../../../shared/components/otp-input/otp-input';
import { ResendAction } from '../../../shared/components/resend-action/resend-action';

@Component({
  selector: 'app-verify-email',
  imports: [CardBody, OtpInput, ResendAction],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  @ViewChild(ResendAction) resendAction!: ResendAction;
  @ViewChild(OtpInput) otpInput!: OtpInput;

  isLoading = signal(false);
  private hasSentInitialOtp = false;

  // envia o otp na inicialização da página
  ngOnInit(): void {
    this.sendInitialOtp();
  }

  private sendInitialOtp() {
    const user = this.userService.userData();
    if (!user || this.hasSentInitialOtp) return;

    this.authService.sendEmailVerificationOtp(user.id).subscribe({
      next: () => (this.hasSentInitialOtp = true),
      error: (err) => alert(err.error?.message || "Something didn't work! Try again."),
    });
  }

  // recebe o código
  handleOtpSubmit(otp: string) {
    const user = this.userService.userData();
    if (!user) return;

    this.isLoading.set(true);
    this.authService.checkEmailOtp(user.id, otp).subscribe({
      next: () => {
        // atualiza o estado do usuário para verificado (isAccountVerified: true)
        this.authService.verifySession().subscribe(() => {
          this.router.navigate(['/home']);
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.error?.message || 'Invalid code.');
        this.otpInput.reset(); // limpa os campos se o código estiver errado
      },
    });
  }

  // reenvia o código
  handleResend() {
    this.resendAction.setResending(true);
    this.authService.resendOtp('VERIFY').subscribe({
      next: (res) => {
        alert(res.message);
        this.resendAction.startTimer();
      },
      error: (err) => alert(err.error?.message || "Something didn't work! Try again."),
      complete: () => this.resendAction.setResending(false),
    });
  }
}

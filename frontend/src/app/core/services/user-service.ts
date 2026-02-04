import { computed, Injectable, signal } from '@angular/core';

export interface UserData {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userState = signal<UserData | null>({
    id: '507f1f77bcf86cd799439011',
    name: 'User',
    email: 'user@example.com',
    isAccountVerified: false,
  });

  // expondo os dados apenas para leitura
  userData = this.userState.asReadonly();

  firstName = computed(() => this.userData()?.name.split(' ')[0] || 'User');
  firstNameLetter = computed(() => this.firstName()[0].toUpperCase());
  isVerified = computed(() => !!this.userData()?.isAccountVerified);

  setUserData(data: UserData | null) {
    this.userState.set(data);
  }
}

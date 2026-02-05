import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserData } from './user-service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  /* resource: /users */
  register(payload: any): Observable<UserData> {
    return this.http.post<UserData>(`${this.API_URL}/users`, payload, {
      withCredentials: true,
    });
  }

  /* resource: /sessions */
  login(credentials: any): Observable<UserData> {
    return this.http.post<UserData>(`${this.API_URL}/sessions/login`, credentials, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post<UserData>(
      `${this.API_URL}/sessions/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post<any>('http://localhost:3000/login', data);
  }

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  refreshToken() {
    return this.http.post<any>('http://localhost:3000/refresh', {
      refreshToken: this.getRefreshToken()
    });
  }

  logout() {
    localStorage.clear();
  }
}
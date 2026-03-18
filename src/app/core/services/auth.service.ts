import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import  { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = 'http://pro-karupan-backend.onrender.com/';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ================= LOGIN =================
  login(data: any) {
    return this.http.post<any>(`${this.API}/login`, data);
  }

  getUserFromToken() {
  const token = this.getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode<any>(token);
  } catch {
    return null;
  }
}
saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('token', accessToken);       
  localStorage.setItem('refreshToken', refreshToken);
}

  // ================= TOKEN =================
getAccessToken() {
  return localStorage.getItem('token');            
}

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  refreshToken() {
    return this.http.post<any>(`${this.API}/refresh`, {
      refreshToken: this.getRefreshToken()
    });
  }

  // ================= CURRENT USER =================
  async loadCurrentUser() {
    try {
      const user = await firstValueFrom(
        this.http.get<any>(`${this.API}/me`)
      );

      this.currentUserSubject.next(user);
      return user;

    } catch (error) {
      this.logout();
      return null;
    }
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  // ================= ROLE CHECK =================
  hasRole(role: string) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ================= LOGOUT =================
  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

}
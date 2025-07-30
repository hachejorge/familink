import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`https://familink-back.onrender.com/login`, {
      username,
      password
    });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRootPersonId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.rootPerson || 1;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.role || null;
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.username || null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN';
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginRequest { username: string; password: string; }
export interface RegisterRequest { username: string; password: string; role: string; }
export interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'username';
  private readonly ROLE_KEY = 'user_role';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', credentials).pipe(
      tap(res => {
        const role = this.decodeRole(res.token);
        console.log('ROL DECODIFICADO:', role);
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, credentials.username);
        localStorage.setItem(this.ROLE_KEY, role);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post('/auth/register', data);
  }

  logout(): void {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  getUsername(): string | null { return localStorage.getItem(this.USER_KEY); }
  getRole(): string { return localStorage.getItem(this.ROLE_KEY) || 'ROLE_USER'; }

  isAdmin(): boolean {
    const role = this.getRole().toUpperCase().trim();
    console.log('isAdmin check - rol:', role, '- resultado:', role === 'ROLE_ADMIN');
    return role === 'ROLE_ADMIN';
  }

  isLoggedIn(): boolean { return this.hasToken(); }
  private hasToken(): boolean { return !!localStorage.getItem(this.TOKEN_KEY); }

  private decodeRole(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT payload completo:', payload);
      const roles = payload.roles || payload.role || payload.authorities;
      if (Array.isArray(roles)) {
        const r = roles[0];
        return (typeof r === 'object' ? r.authority : r) || 'ROLE_USER';
      }
      return roles || 'ROLE_USER';
    } catch { return 'ROLE_USER'; }
  }
}

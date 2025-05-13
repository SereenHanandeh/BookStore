import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  private loggedIn = new BehaviorSubject<boolean>(this.hasUser());
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private hasUser(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('user');
    }
    return false;
  }

  register(user: any): Observable<any> {
    user.password = btoa(unescape(encodeURIComponent(user.password)));
    return this.http.post(this.apiUrl, user);
  }

  login(email: string, password: string): Observable<any[]> {
    const encodedPassword = btoa(unescape(encodeURIComponent(password)));
    return this.http.get<any[]>(
      `${this.apiUrl}?email=${email}&password=${encodedPassword}`
    );
  }

  setAuth(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn.next(true); // ← تحديث الحالة
  }

  logout(): void {
    localStorage.removeItem('user');
    this.loggedIn.next(false); // ← تحديث الحالة
    this.router.navigate(['/login']);
  }

  // ✅ جلب المستخدم الحالي
  getUser(): any {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  // ✅ التحقق مما إذا كان المستخدم مسجلاً دخوله
  isAuthenticated(): boolean {
    return this.hasUser();
  }

  // ✅ جلب دور المستخدم
  getUserRole(): string {
    return this.getUser()?.role || 'user';
  }

  // ✅ التحقق إذا كان المستخدم مسؤول (admin)
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}

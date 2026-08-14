import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'hrithik123';

  // ==========================
  // Admin Login
  // ==========================

  login(username: string, password: string): boolean {

    return (
      username.trim() === this.ADMIN_USERNAME &&
      password === this.ADMIN_PASSWORD
    );

  }

  // ==========================
  // Logout
  // ==========================

  logout(): void {

    localStorage.removeItem('loggedIn');

    localStorage.removeItem('token');

    localStorage.removeItem('currentUser');

  }

  // ==========================
  // Remember Admin Login
  // ==========================

  rememberLogin(): void {

    localStorage.setItem('loggedIn', 'true');

  }

  // ==========================
  // Check Admin Login
  // ==========================

  isLoggedIn(): boolean {

    return localStorage.getItem('loggedIn') === 'true';

  }

  // ==========================
  // Subscriber User
  // ==========================

  setCurrentUser(user: any): void {

    localStorage.setItem(
      'currentUser',
      JSON.stringify(user)
    );

  }

  // ==========================
  // Get Current User
  // ==========================

  getCurrentUser(): any {

    const user = localStorage.getItem('currentUser');

    return user ? JSON.parse(user) : null;

  }

}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'hrithik123';

  login(username: string, password: string): boolean {

    return (
      username.trim() === this.ADMIN_USERNAME &&
      password === this.ADMIN_PASSWORD
    );

  }

  logout(): void {

    localStorage.removeItem('loggedIn');

  }

  rememberLogin(): void {

    localStorage.setItem('loggedIn', 'true');

  }

  isLoggedIn(): boolean {

    return localStorage.getItem('loggedIn') === 'true';

  }
  setCurrentUser(user: any): void {

  localStorage.setItem(

    'currentUser',

    JSON.stringify(user)

  );

}

getCurrentUser(): any {

  const user = localStorage.getItem('currentUser');

  return user ? JSON.parse(user) : null;

}

}
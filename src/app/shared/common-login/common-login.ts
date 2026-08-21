import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './common-login.html',
  styleUrl: './common-login.css'
})
export class CommonLogin {

  email = '';
  password = '';

  errorMessage = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    this.http.post<any>(
      'http://localhost:3000/login',
      {
        email: this.email,
        password: this.password
      }
    ).subscribe({

      next: (response) => {

        console.log('Login response:', response);

        if (!response.success) {
          this.errorMessage =
            response.message || 'Login failed.';
          this.loading = false;
          return;
        }

        // Save JWT
        localStorage.setItem(
          'token',
          response.token
        );

        // Save user information
        localStorage.setItem(
          'currentUser',
          JSON.stringify(response.user)
        );

        // Save role
        localStorage.setItem(
          'loggedIn',
          'true'
        );

        this.loading = false;

        // Redirect according to role

        if (response.role === 'admin') {

          this.router.navigate(['/dashboard']);

        } else if (response.role === 'editor') {

          this.router.navigate(['/editor/dashboard']);

        } else if (response.role === 'subscriber') {

          this.router.navigate(['/subscriber/home']);

        } else {

          this.errorMessage =
            'Unknown user role.';
        }

      },

      error: (error) => {

        console.error('Login error:', error);

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Invalid email or password.';
      }

    });
  }
  goToRegister(): void {

  this.router.navigate([
    '/subscriber-register'
  ]);

}
}
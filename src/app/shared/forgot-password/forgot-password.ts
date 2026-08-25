import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  email = '';
  newPassword = '';
  confirmPassword = '';

  message = '';
  errorMessage = '';

  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  resetPassword(): void {

    this.message = '';
    this.errorMessage = '';

    // -------------------------------
    // Validate email
    // -------------------------------

    if (!this.email.trim()) {

      this.errorMessage =
        'Please enter your email address.';

      return;
    }


    // -------------------------------
    // Validate password
    // -------------------------------

    if (!this.newPassword) {

      this.errorMessage =
        'Please enter a new password.';

      return;
    }


    if (this.newPassword.length < 6) {

      this.errorMessage =
        'Password must contain at least 6 characters.';

      return;
    }


    // -------------------------------
    // Confirm password
    // -------------------------------

    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }


    // -------------------------------
    // Start request
    // -------------------------------

    this.loading = true;


    this.http.post<any>(
      'http://localhost:3000/forgot-password',
      {
        email: this.email.trim(),
        newPassword: this.newPassword
      }
    ).subscribe({

      next: (response) => {

        console.log(
          'Password reset response:',
          response
        );

        this.loading = false;

        this.message =
          response.message ||
          'Password reset successfully.';


        // Return to common login

        setTimeout(() => {

          this.router.navigate([
            '/login'
          ]);

        }, 1500);

      },


      error: (error) => {

        console.error(
          'Password reset failed:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Failed to reset password.';

      }

    });

  }


  // -------------------------------
  // Back to Login
  // -------------------------------

  backToLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }

}
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subscriber-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  message = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================
  // Register Subscriber
  // ==========================

  register(): void {

    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.password.trim() ||
      !this.confirmPassword.trim()
    ) {

      this.message = 'Please fill all fields.';

      return;
    }

    if (this.password !== this.confirmPassword) {

      this.message = 'Passwords do not match.';

      return;
    }

    this.http.post<any>(
      'http://localhost:3000/subscribers',
      {
        name: this.name.trim(),
        email: this.email.trim(),
        phone: this.phone.trim(),
        password: this.password
      }
    ).subscribe({

      next: (response) => {

        this.message =
          response.message || 'Registration successful.';

        this.cdr.detectChanges();

        // Clear form

        this.name = '';
        this.email = '';
        this.phone = '';
        this.password = '';
        this.confirmPassword = '';

        // Go to login after successful registration

        setTimeout(() => {

          this.router.navigate([
            '/subscriber-login'
          ]);

        }, 1500);

      },

      error: (error) => {

        console.error(
          'Registration failed:',
          error
        );

        this.message =
          error.error?.message ||
          'Registration failed.';

        this.cdr.detectChanges();

      }

    });

  }

  // ==========================
  // Go To Login
  // ==========================

  goToLogin(): void {

    this.router.navigate([
      '/subscriber-login'
    ]);

  }

}
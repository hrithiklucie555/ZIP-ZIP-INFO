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
        name: this.name,
        email: this.email,
        phone: this.phone,
        password: this.password
      }
    ).subscribe({

      next: (response) => {

        this.message = response.message;

        this.name = '';
        this.email = '';
        this.phone = '';
        this.password = '';
        this.confirmPassword = '';

        setTimeout(() => {

          this.router.navigate(['/subscriber/login']);

        }, 1500);

      },

      error: (error) => {

        this.message =

          error.error?.message ||

          'Registration failed.';

      }

    });

  }

  goToLogin(): void {

    this.router.navigate(['/subscriber/login']);

  }

}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = "";
  password = "";
  errorMessage = "";
  showPassword = false;
  rememberMe = false;

  constructor(
  private router: Router,
  private authService: AuthService,
  private http: HttpClient
) {}

login(): void {

  if (!this.username.trim() || !this.password.trim()) {

    this.errorMessage = "Please enter username and password.";

    return;

  }

  this.http.post<any>(
    "http://localhost:3000/admin-login",
    {
      username: this.username,
      password: this.password
    }
  ).subscribe({

    next: (response) => {

      this.errorMessage = "";

      // Store Admin JWT
      localStorage.setItem(
        'token',
        response.token
      );

      // Keep existing admin login state
      if (this.rememberMe) {

        this.authService.rememberLogin();

      }

      this.router.navigate(['/dashboard']);

    },

    error: (error) => {

      console.error("Admin login failed:", error);

      this.errorMessage =
        error.error?.message ||
        "Invalid username or password.";

    }

  });

}
}
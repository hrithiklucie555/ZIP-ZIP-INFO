import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    private authService: AuthService
  ) {}

  login(): void {

    if (!this.username.trim() || !this.password.trim()) {

      this.errorMessage = "Please enter username and password.";
      return;

    }

    if (this.authService.login(this.username, this.password)) {

      this.errorMessage = "";

      if (this.rememberMe) {

        this.authService.rememberLogin();

      }

      this.router.navigate(['/dashboard']);

    } else {

      this.errorMessage = "Invalid username or password.";

    }

  }

}
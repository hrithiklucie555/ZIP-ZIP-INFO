import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subscriber-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = "";
  password = "";
  message = "";
  rememberMe = false;
  showPassword = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {

    if (!this.email.trim() || !this.password.trim()) {

      this.message = "Please enter email and password.";

      return;

    }

    this.http.post<any>(
      "http://localhost:3000/subscriber-login",
      {
        email: this.email,
        password: this.password
      }
    ).subscribe({

      next: (response) => {

        localStorage.setItem(
          "subscriber",
          JSON.stringify(response.subscriber)
        );

        this.router.navigate(['/subscriber-home']);

      },

      error: (error) => {

        this.message =
          error.error?.message ||
          "Login failed.";

      }

    });

  }

  goToRegister(): void {

    this.router.navigate(['/subscriber-register']);

  }

}
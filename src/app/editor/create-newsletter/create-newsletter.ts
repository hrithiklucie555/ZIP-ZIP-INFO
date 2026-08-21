import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-newsletter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-newsletter.html',
  styleUrl: './create-newsletter.css'
})
export class CreateNewsletter {

  subject = '';
  category = '';
  content = '';

  message = '';
  errorMessage = '';

  isSubmitting = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  createNewsletter(): void {

    this.message = '';
    this.errorMessage = '';

    if (
      !this.subject.trim() ||
      !this.category.trim() ||
      !this.content.trim()
    ) {

      this.errorMessage =
        'Please fill in all newsletter fields.';

      return;
    }

    const token =
      localStorage.getItem('token');

    if (!token) {

      this.errorMessage =
        'Your session has expired. Please login again.';

      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const newsletter = {

      subject: this.subject.trim(),

      category: this.category.trim(),

      content: this.content.trim()

    };

    this.isSubmitting = true;

    this.http.post<any>(
      'http://localhost:3000/editor/newsletters',
      newsletter,
      { headers }
    ).subscribe({

      next: (response) => {

        console.log(
          'Newsletter created:',
          response
        );

        this.isSubmitting = false;

        this.message =
          'Newsletter saved as draft successfully.';

        setTimeout(() => {

          this.router.navigate([
            '/editor/dashboard'
          ]);

        }, 1000);

      },

      error: (error) => {

        console.error(
          'Newsletter creation failed:',
          error
        );

        this.isSubmitting = false;

        this.errorMessage =
          error.error?.message ||
          'Failed to create newsletter.';

      }

    });
  }

  cancel(): void {

    this.router.navigate([
      '/editor/dashboard'
    ]);

  }

}
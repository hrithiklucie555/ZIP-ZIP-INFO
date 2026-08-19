import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  newsletters: any[] = [];

  totalNewsletters = 0;
  drafts = 0;
  pending = 0;
  published = 0;

  message = '';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadNewsletters();
  }

  loadNewsletters(): void {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(
      'http://localhost:3000/editor/newsletters',
      { headers }
    ).subscribe({

      next: (response) => {

        console.log('Editor newsletters:', response);

        // Handle either an array or { newsletters: [...] }
        this.newsletters =
          Array.isArray(response)
            ? response
            : response.newsletters || [];

        this.calculateStats();
      },

      error: (error) => {

        console.error(
          'Failed to load editor newsletters:',
          error
        );

        this.message =
          error.error?.message ||
          'Failed to load newsletters.';
      }

    });
  }

  calculateStats(): void {

    this.totalNewsletters = this.newsletters.length;

    this.drafts = this.newsletters.filter(
      newsletter => newsletter.status === 'Draft'
    ).length;

    this.pending = this.newsletters.filter(
      newsletter => newsletter.status === 'Pending'
    ).length;

    this.published = this.newsletters.filter(
      newsletter => newsletter.status === 'Published'
    ).length;
  }

}
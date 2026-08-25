import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // ==========================================
  // Newsletter Data
  // ==========================================

  newsletters: any[] = [];


  // ==========================================
  // Dashboard Statistics
  // ==========================================

  totalNewsletters = 0;

  drafts = 0;

  pending = 0;

  published = 0;

  rejected = 0;


  // ==========================================
  // Message
  // ==========================================

  message = '';


  // ==========================================
  // Constructor
  // ==========================================

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  // ==========================================
  // Component Initialization
  // ==========================================

  ngOnInit(): void {

    console.log('Editor Dashboard Loaded');

    this.loadNewsletters();

  }


  // ==========================================
  // Load Editor Newsletters
  // ==========================================

  loadNewsletters(): void {

    const token = localStorage.getItem('token');


    // Check authentication

    if (!token) {

      this.message = 'Please login again.';

      return;

    }


    // Authorization header

    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`

    });


    // Get newsletters created by editor

    this.http.get<any>(
      'http://localhost:3000/editor/newsletters',
      { headers }
    )
    .subscribe({

      // ======================================
      // SUCCESS
      // ======================================

      next: (response) => {

        console.log(
          'Editor newsletters API response:',
          response
        );


        // ------------------------------------
        // Handle different response formats
        // ------------------------------------

        if (Array.isArray(response)) {

          this.newsletters = response;

        }

        else if (
          response &&
          Array.isArray(response.newsletters)
        ) {

          this.newsletters =
            response.newsletters;

        }

        else if (
          response &&
          Array.isArray(response.data)
        ) {

          this.newsletters =
            response.data;

        }

        else {

          console.error(
            'Unexpected newsletter response:',
            response
          );

          this.newsletters = [];

        }


        // ------------------------------------
        // Display newsletter IDs
        // ------------------------------------

        console.table(
          this.newsletters.map(newsletter => ({
            id: newsletter.id,
            subject: newsletter.subject,
            status: newsletter.status
          }))
        );


        // Calculate dashboard statistics

        this.calculateStats();


        // Update Angular UI

        this.cdr.detectChanges();

      },


      // ======================================
      // ERROR
      // ======================================

      error: (error) => {

        console.error(
          'Failed to load editor newsletters:',
          error
        );


        this.message =
          error.error?.message ||
          'Failed to load newsletters.';


        this.cdr.detectChanges();

      }

    });

  }


  // ==========================================
  // Calculate Statistics
  // ==========================================

  calculateStats(): void {

    this.totalNewsletters =
      this.newsletters.length;


    // Drafts

    this.drafts =
      this.newsletters.filter(
        newsletter =>
          newsletter.status
            ?.toLowerCase() === 'draft'
      ).length;


    // Pending

    this.pending =
      this.newsletters.filter(
        newsletter =>
          newsletter.status
            ?.toLowerCase() === 'pending'
      ).length;


    // Published

    this.published =
      this.newsletters.filter(
        newsletter =>
          newsletter.status
            ?.toLowerCase() === 'published'
      ).length;


    // Rejected

    this.rejected =
      this.newsletters.filter(
        newsletter =>
          newsletter.status
            ?.toLowerCase() === 'rejected'
      ).length;


    console.log({

      totalNewsletters:
        this.totalNewsletters,

      drafts:
        this.drafts,

      pending:
        this.pending,

      published:
        this.published,

      rejected:
        this.rejected

    });


    this.cdr.detectChanges();

  }


  // ==========================================
  // Submit Draft For Approval
  // ==========================================

  submitForApproval(newsletterId: number): void {

    console.log(
      'Original newsletter ID:',
      newsletterId
    );


    // ----------------------------------------
    // Convert ID to number
    // ----------------------------------------

    const id = Number(newsletterId);


    console.log(
      'Converted newsletter ID:',
      id,

      'Type:',
      typeof id
    );


    // ----------------------------------------
    // Validate ID
    // ----------------------------------------

    if (
      !newsletterId ||
      Number.isNaN(id) ||
      id <= 0
    ) {

      console.error(
        'Invalid newsletter ID:',
        newsletterId
      );


      this.message =
        'Invalid newsletter ID.';


      return;

    }


    // ----------------------------------------
    // Get authentication token
    // ----------------------------------------

    const token =
      localStorage.getItem('token');


    if (!token) {

      this.message =
        'Please login again.';


      return;

    }


    // ----------------------------------------
    // Authorization Header
    // ----------------------------------------

    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    // ----------------------------------------
    // API URL
    // ----------------------------------------

    const url =
      `http://localhost:3000/editor/newsletters/${id}/submit`;


    console.log(
      'Submitting newsletter to:',
      url
    );


    // ----------------------------------------
    // Submit Newsletter
    // ----------------------------------------

    this.http.post<any>(
      url,
      {},
      { headers }
    )
    .subscribe({

      // ======================================
      // SUCCESS
      // ======================================

      next: (response) => {

        console.log(
          'Newsletter submitted successfully:',
          response
        );


        this.message =
          'Newsletter submitted for admin approval.';


        // Reload newsletter list

        this.loadNewsletters();

      },


      // ======================================
      // ERROR
      // ======================================

      error: (error) => {

        console.error(
          'Failed to submit newsletter:',
          error
        );


        console.error(
          'Backend response:',
          error.error
        );


        this.message =
          error.error?.message ||
          'Failed to submit newsletter for approval.';


        this.cdr.detectChanges();

      }

    });

  }
  logout(): void {

  localStorage.removeItem('token');

  localStorage.removeItem('currentUser');

  localStorage.removeItem('loggedIn');

  localStorage.removeItem('role');

  this.router.navigate(['/login']);

}

}
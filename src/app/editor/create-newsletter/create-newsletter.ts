import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  ActivatedRoute,
  Router
} from '@angular/router';


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


export class CreateNewsletter implements OnInit {


  // ==========================================
  // Newsletter Fields
  // ==========================================

  subject = '';

  category = '';

  content = '';


  // ==========================================
  // Messages
  // ==========================================

  message = '';

  errorMessage = '';


  // ==========================================
  // State
  // ==========================================

  isSubmitting = false;

  isEditMode = false;

  newsletterId: number | null = null;


  // ==========================================
  // Constructor
  // ==========================================

  constructor(

    private http: HttpClient,

    private router: Router,

    private route: ActivatedRoute

  ) {}


  // ==========================================
  // Initialization
  // ==========================================

  ngOnInit(): void {

    /*
     * Check whether an existing newsletter ID
     * was passed in the URL.
     *
     * Example:
     *
     * /editor/create-newsletter?id=7
     */

    this.route.queryParams.subscribe(params => {

      const id =
        Number(params['id']);


      if (
        id &&
        !Number.isNaN(id)
      ) {

        this.newsletterId = id;

        this.isEditMode = true;

        this.loadNewsletter(id);

      }

    });

  }


  // ==========================================
  // Load Existing Newsletter
  // ==========================================

  loadNewsletter(id: number): void {

    this.message = '';

    this.errorMessage = '';


    const token =
      localStorage.getItem('token');


    if (!token) {

      this.errorMessage =
        'Your session has expired. Please login again.';

      return;

    }


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    console.log(
      'Loading newsletter for editing:',
      id
    );


    this.http.get<any>(
      `http://localhost:3000/editor/newsletters/${id}`,
      { headers }
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Newsletter loaded:',
          response
        );


        /*
         * Support both:
         *
         * response.newsletter
         *
         * and direct newsletter response.
         */

        const newsletter =
          response?.newsletter ||
          response;


        if (!newsletter) {

          this.errorMessage =
            'Newsletter not found.';

          return;

        }


        this.subject =
          newsletter.subject || '';


        this.category =
          newsletter.category || '';


        this.content =
          newsletter.content || '';


      },


      error: (error) => {

        console.error(
          'Failed to load newsletter:',
          error
        );


        this.errorMessage =
          error.error?.message ||
          'Failed to load newsletter.';

      }

    });

  }


  // ==========================================
  // CREATE / UPDATE NEWSLETTER
  // ==========================================

  createNewsletter(): void {

    this.message = '';

    this.errorMessage = '';


    // ------------------------------------------
    // Validate Fields
    // ------------------------------------------

    if (

      !this.subject.trim() ||

      !this.category.trim() ||

      !this.content.trim()

    ) {

      this.errorMessage =
        'Please fill in all newsletter fields.';

      return;

    }


    // ------------------------------------------
    // Authentication
    // ------------------------------------------

    const token =
      localStorage.getItem('token');


    if (!token) {

      this.errorMessage =
        'Your session has expired. Please login again.';

      return;

    }


    // ------------------------------------------
    // Headers
    // ------------------------------------------

    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`,

        'Content-Type':
          'application/json'

      });


    // ------------------------------------------
    // Newsletter Data
    // ------------------------------------------

    const newsletter = {

      subject:
        this.subject.trim(),

      category:
        this.category.trim(),

      content:
        this.content.trim()

    };


    this.isSubmitting = true;


    // ==========================================
    // EDIT EXISTING NEWSLETTER
    // ==========================================

    if (
      this.isEditMode &&
      this.newsletterId
    ) {

      console.log(
        'Updating newsletter:',
        this.newsletterId
      );


      this.http.put<any>(

        `http://localhost:3000/editor/newsletters/${this.newsletterId}`,

        newsletter,

        { headers }

      )
      .subscribe({

        next: (response) => {

          console.log(
            'Newsletter updated:',
            response
          );


          this.isSubmitting = false;


          this.message =
            'Newsletter updated successfully.';


          setTimeout(() => {

            this.router.navigate([
              '/editor/dashboard'
            ]);

          }, 1000);

        },


        error: (error) => {

          console.error(
            'Newsletter update failed:',
            error
          );


          this.isSubmitting = false;


          this.errorMessage =
            error.error?.message ||
            'Failed to update newsletter.';

        }

      });


      return;

    }


    // ==========================================
    // CREATE NEW NEWSLETTER
    // ==========================================

    console.log(
      'Creating new newsletter'
    );


    this.http.post<any>(

      'http://localhost:3000/editor/newsletters',

      newsletter,

      { headers }

    )
    .subscribe({

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


  // ==========================================
  // Cancel
  // ==========================================

  cancel(): void {

    this.router.navigate([
      '/editor/dashboard'
    ]);

  }

}
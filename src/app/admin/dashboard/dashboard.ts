import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import { Subscriber } from '../../models/subscriber';
import { Newsletter } from '../../models/newsletter';

import { SubscriberService } from '../../services/subscriber.service';
import { NewsletterService } from '../../services/newsletter.service';


// ==========================================
// Newsletter type used by Admin Dashboard
// ==========================================

type AdminNewsletter = Newsletter & {
  subject?: string;
  title?: string;
  status?: string;
};


// ==========================================
// COMPONENT
// ==========================================

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})


export class Dashboard implements OnInit {


  // ==========================================
  // DATA
  // ==========================================

  subscribers: Subscriber[] = [];

  newsletters: AdminNewsletter[] = [];


  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  totalSubscribers = 0;

  totalNewsletters = 0;

  gmailSubscribers = 0;

  todaysSubscribers = 0;

  publishedNewsletters = 0;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private router: Router,

    private subscriberService: SubscriberService,

    private newsletterService: NewsletterService,

    private cdr: ChangeDetectorRef

  ) {}


  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    console.log('Admin Dashboard Loaded');

    this.loadDashboard();

  }


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  loadDashboard(): void {

    this.loadSubscribers();

    this.loadNewsletters();

  }


  // ==========================================
  // LOAD SUBSCRIBERS
  // ==========================================

  loadSubscribers(): void {

    this.subscriberService
      .getSubscribers()
      .subscribe({

        next: (data: Subscriber[]) => {

          console.log(
            'Subscribers API Response:',
            data
          );


          this.subscribers = data;


          // ------------------------------------------
          // Total Subscribers
          // ------------------------------------------

          this.totalSubscribers =
            this.subscribers.length;


          // ------------------------------------------
          // Gmail Subscribers
          // ------------------------------------------

          this.gmailSubscribers =
            this.subscribers.filter(
              subscriber =>
                subscriber.email
                  ?.toLowerCase()
                  .endsWith('@gmail.com')
            ).length;


          // ------------------------------------------
          // Today's Subscribers
          // ------------------------------------------

          const today =
            new Date().toDateString();


          this.todaysSubscribers =
            this.subscribers.filter(
              subscriber => {

                if (!subscriber.subscribedAt) {
                  return false;
                }

                return (
                  new Date(
                    subscriber.subscribedAt
                  ).toDateString() === today
                );

              }
            ).length;


          this.cdr.detectChanges();


          console.log({
            totalSubscribers:
              this.totalSubscribers,

            gmailSubscribers:
              this.gmailSubscribers,

            todaysSubscribers:
              this.todaysSubscribers
          });

        },


        error: (error) => {

          console.error(
            'Subscribers API Error:',
            error
          );

        }

      });

  }


  // ==========================================
  // LOAD NEWSLETTERS
  // ==========================================

  loadNewsletters(): void {

    this.newsletterService
      .getNewsletters()
      .subscribe({

        next: (data: Newsletter[]) => {

          console.log(
            'Newsletters API Response:',
            data
          );


          // ------------------------------------------
          // Convert API response
          // ------------------------------------------

          this.newsletters =
            data as AdminNewsletter[];


          // ------------------------------------------
          // Total Newsletters
          // ------------------------------------------

          this.totalNewsletters =
            this.newsletters.length;


          // ------------------------------------------
          // Published Newsletters
          // ------------------------------------------

          this.publishedNewsletters =
            this.newsletters.filter(
              newsletter =>
                newsletter.status
                  ?.toLowerCase() === 'published'
            ).length;


          this.cdr.detectChanges();


          console.log({

            totalNewsletters:
              this.totalNewsletters,

            publishedNewsletters:
              this.publishedNewsletters

          });

        },


        error: (error) => {

          console.error(
            'Newsletters API Error:',
            error
          );

        }

      });

  }


  // ==========================================
  // APPROVE NEWSLETTER
  // Pending → Published
  // ==========================================

  approveNewsletter(id: number): void {

    console.log(
      'APPROVE BUTTON CLICKED'
    );

    console.log(
      'Newsletter ID:',
      id
    );


    // ------------------------------------------
    // Validate ID
    // ------------------------------------------

    if (
      id === null ||
      id === undefined ||
      Number.isNaN(Number(id))
    ) {

      console.error(
        'Invalid newsletter ID:',
        id
      );

      return;

    }


    // ------------------------------------------
    // Check Login Token
    // ------------------------------------------

    const token =
      localStorage.getItem('token');


    if (!token) {

      console.error(
        'No authentication token found.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // ------------------------------------------
    // Call Approval API
    // ------------------------------------------

    this.newsletterService
      .approveNewsletter(Number(id))
      .subscribe({

        next: (response) => {

          console.log(
            'Newsletter approved successfully:',
            response
          );


          // ------------------------------------------
          // Reload dashboard
          // ------------------------------------------

          this.loadDashboard();

        },


        error: (error) => {

          console.error(
            'Failed to approve newsletter:',
            error
          );


          console.error(
            'Backend response:',
            error.error
          );

        }

      });

  }


  // ==========================================
  // REJECT NEWSLETTER
  // Pending → Rejected
  // ==========================================

  rejectNewsletter(id: number): void {

    console.log(
      'REJECT BUTTON CLICKED'
    );

    console.log(
      'Newsletter ID:',
      id
    );


    // ------------------------------------------
    // Validate ID
    // ------------------------------------------

    if (
      id === null ||
      id === undefined ||
      Number.isNaN(Number(id))
    ) {

      console.error(
        'Invalid newsletter ID:',
        id
      );

      return;

    }


    // ------------------------------------------
    // Check Login Token
    // ------------------------------------------

    const token =
      localStorage.getItem('token');


    if (!token) {

      console.error(
        'No authentication token found.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // ------------------------------------------
    // Call Reject API
    // ------------------------------------------

    this.newsletterService
      .rejectNewsletter(Number(id))
      .subscribe({

        next: (response) => {

          console.log(
            'Newsletter rejected successfully:',
            response
          );


          // ------------------------------------------
          // Reload dashboard
          // ------------------------------------------

          this.loadDashboard();

        },


        error: (error) => {

          console.error(
            'Failed to reject newsletter:',
            error
          );


          console.error(
            'Backend response:',
            error.error
          );

        }

      });

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  
  logout(): void {

  localStorage.removeItem('token');

  localStorage.removeItem('currentUser');

  localStorage.removeItem('loggedIn');

  localStorage.removeItem('role');

  this.router.navigate(['/login']);

}

}
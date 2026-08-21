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

    console.log('Dashboard Loaded');

    this.loadDashboard();

  }


  // ==========================================
  // LOAD ALL DASHBOARD DATA
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
            data.length;


          // ------------------------------------------
          // Gmail Subscribers
          // ------------------------------------------

          this.gmailSubscribers =
            this.subscribers.filter(
              subscriber =>
                subscriber.email
                  .toLowerCase()
                  .endsWith('@gmail.com')
            ).length;


          // ------------------------------------------
          // Today's Subscribers
          // ------------------------------------------

          const today =
            new Date().toDateString();


          this.todaysSubscribers =
            this.subscribers.filter(
              subscriber =>
                new Date(
                  subscriber.subscribedAt
                ).toDateString() === today
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
          // Convert API response to AdminNewsletter
          // ------------------------------------------

          this.newsletters =
            data as AdminNewsletter[];


          // ------------------------------------------
          // Total Newsletters
          // ------------------------------------------

          this.totalNewsletters =
            this.newsletters.length;

            this.publishedNewsletters =
  this.newsletters.filter(
    newsletter =>
      newsletter.status?.toLowerCase() === 'published'
  ).length;


          this.cdr.detectChanges();


          console.log({

            totalNewsletters:
              this.totalNewsletters

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

    const token =
      localStorage.getItem('token');


    // ------------------------------------------
    // Check Login
    // ------------------------------------------

    if (!token) {

      console.error(
        'No authentication token found.'
      );

      this.router.navigate(['/login']);

      return;

    }


    console.log(
      'Approving newsletter:',
      id
    );


    // ------------------------------------------
    // Call Backend
    // ------------------------------------------

    this.newsletterService
      .approveNewsletter(id)
      .subscribe({

        next: (response) => {

          console.log(
            'Newsletter approved:',
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

        }

      });

  }

  rejectNewsletter(id: number): void {

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found.');
    return;
  }

  this.newsletterService.rejectNewsletter(id).subscribe({

    next: (response) => {

      console.log('Newsletter rejected:', response);

      // Reload dashboard data
      this.loadDashboard();

    },

    error: (error) => {

      console.error(
        'Failed to reject newsletter:',
        error
      );

    }

  });

}


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('loggedIn');

    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }

}
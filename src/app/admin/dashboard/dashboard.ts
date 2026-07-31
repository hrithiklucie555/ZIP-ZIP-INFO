import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { Subscriber } from '../../models/subscriber';
import { Newsletter } from '../../models/newsletter';

import { SubscriberService } from '../../services/subscriber.service';
import { NewsletterService } from '../../services/newsletter.service';

import { ChangeDetectorRef } from '@angular/core';

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

  subscribers: Subscriber[] = [];
  newsletters: Newsletter[] = [];

  totalSubscribers = 0;
  totalNewsletters = 0;
  gmailSubscribers = 0;
  todaysSubscribers = 0;

  constructor(
    private router: Router,
    private subscriberService: SubscriberService,
    private newsletterService: NewsletterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('Dashboard Loaded');

    this.loadDashboard();

  }

  loadDashboard(): void {

    this.loadSubscribers();
    this.loadNewsletters();

  }

  loadSubscribers(): void {

    this.subscriberService.getSubscribers().subscribe({

      next: (data: Subscriber[]) => {

        console.log('Subscribers API Response:', data);

        this.subscribers = data;

        this.totalSubscribers = data.length;

        this.gmailSubscribers = this.subscribers.filter(subscriber =>
          subscriber.email.toLowerCase().endsWith('@gmail.com')
        ).length;

        const today = new Date().toDateString();

        this.todaysSubscribers = this.subscribers.filter(subscriber =>
          new Date(subscriber.subscribedAt).toDateString() === today
        ).length;

        this.cdr.detectChanges();

        console.log({
          totalSubscribers: this.totalSubscribers,
          gmailSubscribers: this.gmailSubscribers,
          todaysSubscribers: this.todaysSubscribers
        });

      },

      error: (error) => {

        console.error('Subscribers API Error:', error);

      }

    });

  }

  loadNewsletters(): void {

    this.newsletterService.getNewsletters().subscribe({

      next: (data: Newsletter[]) => {

        console.log('Newsletters API Response:', data);

        this.newsletters = data;

        this.totalNewsletters = this.newsletters.length;
        this.cdr.detectChanges();

        console.log({
          totalNewsletters: this.totalNewsletters
        });

      },

      error: (error) => {

        console.error('Newsletters API Error:', error);

      }

    });

  }

  logout(): void {

    localStorage.removeItem('loggedIn');

    this.router.navigate(['/login']);

  }

}
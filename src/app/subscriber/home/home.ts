import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Newsletter {

  id: number;

  subject: string;

  category: string;

  content: string;

  author: string;

  status: string;

  createdAt: string;

}

@Component({

  selector: 'app-subscriber-home',

  standalone: true,

  imports: [

    CommonModule,

    DatePipe

  ],

  templateUrl: './home.html',

  styleUrl: './home.css'

})

export class SubscriberHome implements OnInit {

  // ==========================
  // Subscriber
  // ==========================

  subscriberName = "";

  currentDate = new Date();

  // ==========================
  // Latest Newsletter
  // ==========================

  latestNewsletter: Newsletter = {

    id: 0,

    subject: "No Newsletters Available",

    category: "-",

    content: "No newsletters have been published yet.",

    author: "",

    status: "",

    createdAt: ""

  };

  // ==========================
  // Statistics
  // ==========================

  totalNewsletters = 0;

  totalCategories = 0;

  newThisWeek = 0;

  constructor(

    private http: HttpClient,

    private router: Router,

    private cdr: ChangeDetectorRef,

    private authService: AuthService

  ) {}

  ngOnInit(): void {

  const user = this.authService.getCurrentUser();

  if (user) {
    this.subscriberName = user.name;
  }

  this.loadHomeData();

}

  // ==========================
  // Load Home Data
  // ==========================

  loadHomeData(): void {

    this.http.get<Newsletter[]>(

      "http://localhost:3000/newsletters"

    ).subscribe({

      next: (data) => {

        this.totalNewsletters = data.length;

        this.totalCategories =

          new Set(

            data.map(newsletter => newsletter.category)

          ).size;

        // Latest Newsletter

        if (data.length > 0) {

          this.latestNewsletter =

            data[data.length - 1];

        }

        // Newsletters Published This Week

        const today = new Date();

        const oneWeekAgo = new Date();

        oneWeekAgo.setDate(

          today.getDate() - 7

        );

        this.newThisWeek =

          data.filter(newsletter =>

            new Date(newsletter.createdAt) >= oneWeekAgo

          ).length;

          this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(

          "Failed to load home data",

          error

        );

      }

    });

  }

  // ==========================
  // Read Latest Newsletter
  // ==========================

  readLatestNewsletter(): void {

    if (this.latestNewsletter.id !== 0) {

      this.router.navigate([

        "/subscriber/newsletter",

        this.latestNewsletter.id

      ]);

    }

  }

  goToInbox(): void {

  this.router.navigate([
    '/subscriber/inbox'
  ]);

}

}
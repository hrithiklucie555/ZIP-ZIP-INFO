import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscriber } from '../../models/subscriber';
import { Newsletter } from '../../models/newsletter';

import { SubscriberService } from '../../services/subscriber.service';
import { NewsletterService } from '../../services/newsletter.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  subscribers: Subscriber[] = [];
  newsletters: Newsletter[] = [];

  totalSubscribers = 0;
  totalNewsletters = 0;

  gmailUsers = 0;
  yahooUsers = 0;
  outlookUsers = 0;

  technologyNewsletters = 0;
  businessNewsletters = 0;
  generalNewsletters = 0;

  constructor(
    private subscriberService: SubscriberService,
    private newsletterService: NewsletterService,
    private cdr:ChangeDetectorRef,
  ) {}

  ngOnInit(): void {

    this.loadSubscribers();

    this.loadNewsletters();

  }

  loadSubscribers(): void {

    this.subscriberService.getSubscribers().subscribe({

      next: (data: Subscriber[]) => {

        this.subscribers = data;

        this.totalSubscribers = data.length;

        this.gmailUsers = data.filter(subscriber =>

          subscriber.email.toLowerCase().includes('@gmail.com')

        ).length;

        this.yahooUsers = data.filter(subscriber =>

          subscriber.email.toLowerCase().includes('@yahoo.com')

        ).length;

        this.outlookUsers = data.filter(subscriber =>

          subscriber.email.toLowerCase().includes('@outlook.com')

        ).length;

        this.cdr.detectChanges();

        setTimeout(() => {

                       this.createCategoryChart();

                        }, 0);

      },

      error: (error) => {

        console.error('Failed to load subscribers', error);

      }

    });

  }

  loadNewsletters(): void {

    this.newsletterService.getNewsletters().subscribe({

      next: (data: Newsletter[]) => {

        this.newsletters = data;

        this.totalNewsletters = data.length;

        this.technologyNewsletters = data.filter(newsletter =>

          newsletter.category === 'Technology'

        ).length;

        this.businessNewsletters = data.filter(newsletter =>

          newsletter.category === 'Business'

        ).length;

        this.generalNewsletters = data.filter(newsletter =>

          newsletter.category === 'General'

        ).length;

        this.cdr.detectChanges();

        setTimeout(() => {

                           this.createEmailChart();

                       }, 0);

      },

      error: (error) => {

        console.error('Failed to load newsletters', error);

      }

    });

  }
  createEmailChart(): void {

  new Chart('emailChart', {

    type: 'pie',

    data: {

      labels: [

        'Gmail',

        'Yahoo',

        'Outlook'

      ],

      datasets: [

        {

          data: [

            this.gmailUsers,

            this.yahooUsers,

            this.outlookUsers

          ]

        }

      ]

    },

    options: {

      responsive: true

    }

  });

}

createCategoryChart(): void {

  new Chart('categoryChart', {

    type: 'bar',

    data: {

      labels: [

        'Technology',

        'Business',

        'General'

      ],

      datasets: [

        {

          label: 'Newsletters',

          data: [

            this.technologyNewsletters,

            this.businessNewsletters,

            this.generalNewsletters

          ]

        }

      ]

    },

    options: {

      responsive: true,

      plugins: {

        legend: {

          display: false

        }

      }

    }

  });

}

}
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NewsletterService } from '../../services/newsletter.service';
import { Newsletter } from '../../models/newsletter';

@Component({
  selector: 'app-newsletters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './newsletters.html',
  styleUrl: './newsletters.css'
})
export class Newsletters {

  newsletter: Newsletter = {

    id: 0,
    title: '',
    category: '',
    content: '',
    image: '',
    publishedAt: ''

  };

  message = '';

  constructor(
    private newsletterService: NewsletterService
  ) {}

  publish(): void {

    if (

      !this.newsletter.title.trim() ||

      !this.newsletter.category.trim() ||

      !this.newsletter.content.trim()

    ) {

      this.message = 'Please fill all required fields.';

      return;

    }

    this.newsletterService.publishNewsletter(

      this.newsletter

    ).subscribe({

      next: () => {

        this.message = 'Newsletter published successfully.';

        this.newsletter = {

          id: 0,
          title: '',
          category: '',
          content: '',
          image: '',
          publishedAt: ''

        }
    ;


      },

      error: (error) => {

        this.message =

          error.error?.message ||

          'Failed to publish newsletter.';

      }

    });

  }

}
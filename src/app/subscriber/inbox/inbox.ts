import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Newsletter } from '../../models/newsletter';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css'
})
export class Inbox implements OnInit {

  newsletters: Newsletter[] = [];
  filteredNewsletters: Newsletter[] = [];

  search = '';

  constructor(
    private newsletterService: NewsletterService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadNewsletters();

  }

  loadNewsletters(): void {

    this.newsletterService.getNewsletters().subscribe({

      next: (data: Newsletter[]) => {

        this.newsletters = data;

        this.filteredNewsletters = data;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load newsletters', error);

      }

    });

  }

  filterNewsletters(): void {

    const value = this.search.trim().toLowerCase();

    this.filteredNewsletters = this.newsletters.filter(newsletter =>

      newsletter.title.toLowerCase().includes(value) ||

      newsletter.category.toLowerCase().includes(value)

    );

  }

  openNewsletter(id: number): void {

    this.router.navigate(['/newsletter', id]);

  }

}
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

  // ==========================
  // Newsletter Data
  // ==========================

  newsletters: Newsletter[] = [];

  filteredNewsletters: Newsletter[] = [];

  // ==========================
  // Search & Filter
  // ==========================

  search = '';

  categories: string[] = [];

  selectedCategory = '';

  // ==========================
  // Dashboard Statistics
  // ==========================

  totalNewsletters = 0;

  totalCategories = 0;

  readCount = 0;

  unreadCount = 0;

  constructor(
    private newsletterService: NewsletterService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================
  // On Init
  // ==========================

  ngOnInit(): void {

    this.loadNewsletters();

  }

  // ==========================
  // Load Newsletters
  // ==========================

  loadNewsletters(): void {

    this.newsletterService.getNewsletters().subscribe({

      next: (data: Newsletter[]) => {

        this.newsletters = data;

        this.filteredNewsletters = data;

        // Dashboard Cards

        this.totalNewsletters = data.length;

        this.categories = [
          ...new Set(
            data.map(newsletter => newsletter.category)
          )
        ];

        this.totalCategories = this.categories.length;

        // Temporary statistics

        this.readCount = 0;

        this.unreadCount = data.length;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Failed to load newsletters',
          error
        );

      }

    });

  }

  // ==========================
  // Search & Category Filter
  // ==========================

  filterNewsletters(): void {

    const value = this.search.trim().toLowerCase();

    this.filteredNewsletters = this.newsletters.filter(newsletter => {

      const matchesSearch =

        newsletter.title
          .toLowerCase()
          .includes(value)

        ||

        newsletter.category
          .toLowerCase()
          .includes(value);

      const matchesCategory =

        this.selectedCategory === ''

        ||

        newsletter.category === this.selectedCategory;

      return matchesSearch && matchesCategory;

    });

  }

  // ==========================
  // Open Newsletter
  // ==========================

  openNewsletter(id: number): void {

    this.router.navigate([

      '/newsletter',

      id

    ]);

  }

}
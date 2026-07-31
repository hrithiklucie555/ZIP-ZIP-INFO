import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Newsletter } from '../../models/newsletter';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-manage-newsletters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-newsletters.html',
  styleUrl: './manage-newsletters.css'
})
export class ManageNewsletters implements OnInit {

  newsletters: Newsletter[] = [];
  filteredNewsletters: Newsletter[] = [];

  search = '';

  selectedNewsletter: Newsletter | null = null;

  deleteNewsletterData: Newsletter | null = null;

  showDeleteModal = false;

  constructor(
    private newsletterService: NewsletterService,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadNewsletters();

  }

  loadNewsletters(): void {

    this.newsletterService.getNewsletters().subscribe({

      next: (data: Newsletter[]) => {

        this.newsletters = data;
        this.filteredNewsletters = [...data];
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

  editNewsletter(newsletter: Newsletter): void {

    this.showDeleteModal = false;
    this.deleteNewsletterData = null;

    this.selectedNewsletter = { ...newsletter };

  }

  saveNewsletter(): void {

    if (!this.selectedNewsletter) {

      return;

    }

    this.newsletterService.updateNewsletter(

      this.selectedNewsletter.id,

      this.selectedNewsletter

    ).subscribe({

      next: () => {

        this.selectedNewsletter = null;

        this.loadNewsletters();

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Update failed', error);

      }

    });

  }

  cancelEdit(): void {

    this.selectedNewsletter = null;

  }

  openDeleteModal(newsletter: Newsletter): void {

    this.selectedNewsletter = null;

    this.deleteNewsletterData = newsletter;

    this.showDeleteModal = true;

  }

  confirmDelete(): void {

    if (!this.deleteNewsletterData) {

      return;

    }

    this.newsletterService.deleteNewsletter(

      this.deleteNewsletterData.id

    ).subscribe({

      next: () => {

        this.showDeleteModal = false;

        this.deleteNewsletterData = null;

        this.loadNewsletters();

      },

      error: (error) => {

        console.error('Delete failed', error);

      }

    });

  }

  cancelDelete(): void {

    this.showDeleteModal = false;

    this.deleteNewsletterData = null;

  }

}
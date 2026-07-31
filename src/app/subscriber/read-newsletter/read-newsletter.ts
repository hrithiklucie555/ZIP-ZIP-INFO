import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Newsletter } from '../../models/newsletter';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-read-newsletter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './read-newsletter.html',
  styleUrl: './read-newsletter.css'
})
export class ReadNewsletter implements OnInit {

  newsletter: Newsletter | null = null;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsletterService: NewsletterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id)) {

      this.router.navigate(['/subscriber-inbox']);

      return;

    }

    this.newsletterService.getNewsletters().subscribe({

      next: (data: Newsletter[]) => {

        this.newsletter = data.find(

          newsletter => newsletter.id === id

        ) || null;

        this.loading = false;
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load newsletter', error);

        this.loading = false;

      }

    });

  }

  back(): void {

    this.router.navigate(['/subscriber-inbox']);

  }

}
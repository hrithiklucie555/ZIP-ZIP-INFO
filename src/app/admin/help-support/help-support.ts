import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help-support.html',
  styleUrl: './help-support.css'
})
export class HelpSupport implements OnInit {

  pageTitle = 'Support Center';

  pageDescription =
    'Manage subscriber support requests, technical issues, feedback and service enquiries.';

  stats = [
    {
      title: 'Open Tickets',
      value: 0,
      icon: 'fa-solid fa-envelope-open-text'
    },
    {
      title: 'Pending',
      value: 0,
      icon: 'fa-solid fa-clock'
    },
    {
      title: 'Resolved',
      value: 0,
      icon: 'fa-solid fa-circle-check'
    },
    {
      title: 'High Priority',
      value: 0,
      icon: 'fa-solid fa-triangle-exclamation'
    }
  ];

  tickets: any[] = [];

  selectedTicket: any = null;

  searchText = '';

  selectedStatus = '';

  selectedPriority = '';

  constructor(

    private supportService: SupportService,

    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {

    this.loadTickets();

  }

  loadTickets(): void {

    this.supportService.getTickets().subscribe({

      next: (data: any[]) => {

        this.tickets = data;

        this.updateStatistics();

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load tickets', error);

      }

    });

  }

  updateStatistics(): void {

  this.stats[0].value = this.tickets.filter(

    ticket =>
      (ticket.status || 'Open').toLowerCase() === 'open'

  ).length;

  this.stats[1].value = this.tickets.filter(

    ticket =>
      (ticket.status || '').toLowerCase() === 'pending'

  ).length;

  this.stats[2].value = this.tickets.filter(

    ticket =>
      (ticket.status || '').toLowerCase() === 'resolved'

  ).length;

  this.stats[3].value = this.tickets.filter(

    ticket =>
      (ticket.priority || '').toLowerCase() === 'high'

  ).length;

}

  viewTicket(ticket: any): void {

    this.selectedTicket = { ...ticket };

  }

  closeTicketDetails(): void {

    this.selectedTicket = null;

  }

  saveTicket(): void {

    if (!this.selectedTicket) {

      return;

    }

    this.supportService.updateTicket(

      this.selectedTicket.id,

      this.selectedTicket

    ).subscribe({

      next: () => {

        alert('Ticket updated successfully.');

        this.selectedTicket = null;

        this.loadTickets();

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Update failed', error);

      }

    });

  }

  deleteTicket(ticket: any): void {

    if (!confirm('Delete this ticket?')) {

      return;

    }

    this.supportService.deleteTicket(ticket.id).subscribe({

      next: () => {

        this.loadTickets();

      },

      error: (error) => {

        console.error('Delete failed', error);

      }

    });

  }

}
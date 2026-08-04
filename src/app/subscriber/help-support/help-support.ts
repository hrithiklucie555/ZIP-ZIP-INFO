import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private supportService: SupportService,
    
      
    private cdr: ChangeDetectorRef
  ) {}

  // ===============================
  // Form
  // ===============================

  ticket = {

    subscriber: '',

    email: '',

    category: '',

    subject: '',

    description: ''

  };

  // ===============================
  // Ticket List
  // ===============================

  tickets: any[] = [];

  selectedTicket: any = null;

  message = '';

  loading = false;

  // ===============================
  // On Init
  // ===============================

  ngOnInit(): void {

    // Temporary values

    this.ticket.subscriber = 'Hrithik';

    this.ticket.email = 'hrithik@gmail.com';

    this.loadTickets();

  }

  // ===============================
  // Load Tickets
  // ===============================

  loadTickets(): void {

    this.supportService.getTickets().subscribe({

      next: (data: any[]) => {

        this.tickets = data.filter(ticket =>

          ticket.email === this.ticket.email

        );
        this.cdr.detectChanges();

      },

      error: (error: any) => {

        console.error(error);

      }

    });

  }

  // ===============================
  // Submit Ticket
  // ===============================

  submitTicket(): void {

    if (

      !this.ticket.category ||

      !this.ticket.subject ||

      !this.ticket.description

    ) {

      this.message = 'Please complete all fields.';

      

      return;

    }

    this.loading = true;

    this.supportService.createTicket(this.ticket).subscribe({

      next: () => {

        this.message = 'Support ticket submitted successfully.';

        this.loading = false;

        this.ticket.category = '';

        this.ticket.subject = '';

        this.ticket.description = '';

        this.loadTickets();

        

      },

      error: (error: any) => {

        console.error(error);

        this.loading = false;

        this.message = 'Unable to submit ticket.';

      }

    });

  }

  // ===============================
  // View Ticket
  // ===============================

  viewTicket(ticket: any): void {

    this.selectedTicket = ticket;

  }

  // ===============================
  // Close Popup
  // ===============================

  closeTicket(): void {

    this.selectedTicket = null;

  }

}
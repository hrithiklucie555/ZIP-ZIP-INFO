import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  constructor(private router: Router,
    
  ) {}

  // ==========================
  // Subscriber Information
  // ==========================

  subscriberName = '';

  subscriberEmail = '';

  // ==========================
  // Dashboard Statistics
  // ==========================

  unreadCount = 5;

  readCount = 12;

  ticketCount = 2;

  notificationCount = 3;

  // ==========================
  // On Init
  // ==========================

  ngOnInit(): void {

    const subscriber = localStorage.getItem('subscriber');

    if (subscriber) {

      const user = JSON.parse(subscriber);

      this.subscriberName = user.name;

      this.subscriberEmail = user.email;


    }
    else{

      // Temporary values

      this.subscriberName = 'Subscriber';

      this.subscriberEmail = 'subscriber@example.com';

    }

  }

  // ==========================
  // Navigation
  // ==========================

  openInbox(): void {

    this.router.navigate(['/subscriber/inbox']);

  }

  openReadNewsletters(): void {

    this.router.navigate(['/subscriber/read-newsletter']);

  }

  openSupport(): void {

    this.router.navigate(['/subscriber/help-support']);

  }

  // Future Features

  openProfile(): void {

    console.log('Profile Coming Soon');

  }

  openNotifications(): void {

    console.log('Notifications Coming Soon');

  }

  openActivity(): void {

    console.log('Activity Coming Soon');

  }

  // ==========================
  // Logout
  // ==========================

  logout(): void {

    localStorage.removeItem('subscriber');

    this.router.navigate(['/subscriber/login']);

  }

}
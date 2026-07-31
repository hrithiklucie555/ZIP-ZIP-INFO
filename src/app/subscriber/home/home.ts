import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  subscriberName = '';
  subscriberEmail = '';

  constructor(
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const subscriber = localStorage.getItem('subscriber');

    if (!subscriber) {

      this.router.navigate(['/subscriber-login']);

      return;

    }

    try {

      const user = JSON.parse(subscriber);

      this.subscriberName = user.name;

      this.subscriberEmail = user.email;

    }

    catch {

      localStorage.removeItem('subscriber');

      this.router.navigate(['/subscriber-login']);

    }

  }

  openInbox(): void {

    this.router.navigate(['/subscriber-inbox']);

  }

  logout(): void {

    localStorage.removeItem('subscriber');

    this.router.navigate(['/subscriber-login']);

  }

}
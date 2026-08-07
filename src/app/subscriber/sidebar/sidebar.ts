import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-subscriber-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  constructor(
    private router: Router
  ) {}

  // ==========================
  // Logout
  // ==========================

  logout(): void {

    localStorage.removeItem('subscriber');

    this.router.navigate(['/subscriber/login']);

  }

}
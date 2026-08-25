import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';

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
    private router: Router,
    private authService: AuthService
  ) {}

  // ==========================
  // Logout
  // ==========================

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}
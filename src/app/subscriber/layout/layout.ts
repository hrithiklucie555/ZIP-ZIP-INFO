import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-subscriber-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/subscriber-login']);

  }

}
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  constructor(private router: Router) {}

  logout(): void {

    // Clear login/session information
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loggedIn');

    // Go to the COMMON login page
    this.router.navigate(['/login']);
}

}
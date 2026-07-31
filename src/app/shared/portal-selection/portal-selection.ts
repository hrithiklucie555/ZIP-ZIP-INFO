import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal-selection',
  standalone: true,
  imports: [],
  templateUrl: './portal-selection.html',
  styleUrl: './portal-selection.css'
})
export class PortalSelection {

  constructor(private router: Router) {}

  goToAdmin(): void {

    this.router.navigate(['/login']);

  }

  goToSubscriber(): void {

    this.router.navigate(['/subscriber-login']);

  }

}
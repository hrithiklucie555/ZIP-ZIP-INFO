import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

  // Profile

  adminName = 'Hrithik';
  adminEmail = 'admin@yahoo.com';
  adminPhone = '8925059442';

  // Password

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  message = '';

  saveProfile(): void {

    this.message = '✅ Profile updated successfully.';

  }

  updatePassword(): void {

    if (this.newPassword !== this.confirmPassword) {

      this.message = '❌ Passwords do not match.';

      return;

    }

    this.message = '✅ Password updated successfully.';

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

  }

}
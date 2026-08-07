import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';

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

}
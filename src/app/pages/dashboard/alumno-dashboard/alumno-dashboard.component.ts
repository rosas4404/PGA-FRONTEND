import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-alumno-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterModule,CommonModule],
  templateUrl: './alumno-dashboard.component.html',
  styleUrl: './alumno-dashboard.component.scss'
})
export class AlumnoDashboardComponent {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

}

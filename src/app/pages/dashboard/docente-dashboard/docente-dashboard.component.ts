import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterModule,CommonModule],
  templateUrl: './docente-dashboard.component.html',
  styleUrl: './docente-dashboard.component.scss'
})
export class DocenteDashboardComponent {

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

}


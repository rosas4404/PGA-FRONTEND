import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { routes } from '../../../app.routes';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from '../../usuarios/usuarios.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterModule,CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    //se cierra el sub menu al disminuir la barra
    if(this.isCollapsed){
      this.expedienteAbierto=false;
    }
  }

  //sub menu para el expediente
  expedienteAbierto = false;

  toggleExpedicnete(){
    this.expedienteAbierto = !this.expedienteAbierto;
  }

  cerrarSubmenu(){
    this.expedienteAbierto=false;
  }
}

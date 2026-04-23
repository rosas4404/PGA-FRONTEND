import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { routes } from '../../../app.routes';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from '../../Administrador/usuarios/usuarios.component'; 
import { usuarioDTOResponse } from '../../../models/dto/ResponseDto/usuarioDTOResponse';
import { LoginService } from '../../../services/login.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterModule,CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{

  isCollapsed = false;
  hoverMenu = false;

  idUsuario : number = 0;
  usuario : usuarioDTOResponse | null = null;

  constructor(
      private loginService : LoginService,
      private usuarioService : UsuarioService
    ){}
    ngOnInit(): void {
      this.obtenerUsuario();
    }

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
    this.hoverMenu=false;
  }
  
  mouseEntra() {
    if (this.isCollapsed) {
      this.hoverMenu = true;
    }
  }

  mouseSale() {
    this.hoverMenu = false;
  }

  obtenerUsuario(){
    this.loginService.getCurrentUser().subscribe({
      next : (data) => {
        this.idUsuario =  data.id;
        this.usuarioService.obtenerUsuarioId(this.idUsuario).subscribe({
          next : (data) => {
            this.usuario =  data;
          }
        })
      }
    })
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { usuarioDTO } from '../../../models/dto/usuarioDTO';
import { UsuarioService } from '../../../services/usuario.service';
import { usuarioDTOResponse } from '../../../models/dto/ResponseDto/usuarioDTOResponse';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterModule,CommonModule],
  templateUrl: './docente-dashboard.component.html',
  styleUrl: './docente-dashboard.component.scss'
})
export class DocenteDashboardComponent implements OnInit{

  isCollapsed = false;
  idUsuario : number = 0;
  usuario : usuarioDTOResponse | null = null;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(
    private loginService : LoginService,
    private usuarioService : UsuarioService
  ){}
  ngOnInit(): void {
    this.obtenerUsuario();
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


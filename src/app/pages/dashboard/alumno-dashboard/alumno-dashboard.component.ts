import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { usuarioDTOResponse } from '../../../models/dto/ResponseDto/usuarioDTOResponse';
import { LoginService } from '../../../services/login.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-alumno-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterModule,CommonModule],
  templateUrl: './alumno-dashboard.component.html',
  styleUrl: './alumno-dashboard.component.scss'
})
export class AlumnoDashboardComponent implements OnInit{
  isCollapsed = false;

  idUsuario : number = 0;
  usuario : usuarioDTOResponse | null = null;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(
    private loginService : LoginService,
    private usuarioService : UsuarioService,
    private router : Router
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

  verGrupo(){
      this.router.navigate(['/alumno-dashboard/grupo/'])
        .then(() => {

        });
  }
}

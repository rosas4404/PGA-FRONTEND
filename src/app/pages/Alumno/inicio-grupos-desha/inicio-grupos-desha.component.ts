import { Component, OnInit } from '@angular/core';
import { grupoAlumnoDTOResponse } from '../../../models/dto/ResponseDto/grupoAlumnoDTOResponse';
import { InscripcionResponseDTO } from '../../../models/dto/ResponseDto/inscripcionResponseDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionService } from '../../../services/inscripcion.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-inicio-grupos-desha',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './inicio-grupos-desha.component.html',
  styleUrl: './inicio-grupos-desha.component.scss'
})

export class InicioGruposDeshaComponent implements OnInit{
  idUsuario!:number;
  grupos: grupoAlumnoDTOResponse [] = [];
  inscripcion!: InscripcionResponseDTO;
  mensajeError = '';
  
  get mostrarLista():boolean{
    return this.route.snapshot.firstChild === null;
  }

  constructor (private router: Router, private inscripcionService : InscripcionService, public route : ActivatedRoute){}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;

    this.cargarGrupos();
  }

  cargarGrupos(){
    this.inscripcionService.consultaGruposAlumno(this.idUsuario).subscribe({
      next: (resp) => {
        this.grupos = resp;
        console.log(resp);
      },
      error: (err)=>{
        if(err.status === 409){
          const mensajeServidor = typeof err.error === 'string' ? err.error : err.error.message;
          this.mensajeError = mensajeServidor; 
        } else {
          this.mensajeError = "Ocurrió un error inesperado al consultar.";
        }
      }
    });
  }

  verDetalleGrupo(idInscripcion : number, idGrupo : number){
    this.router.navigate(['grupo-deshabilitado', idInscripcion, idGrupo], { relativeTo: this.route }); //navegacion para entrar al hijo
  }

}

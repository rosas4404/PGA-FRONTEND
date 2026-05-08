import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionService } from '../../../services/inscripcion.service';
import { InscripcionResponseDTO } from '../../../models/dto/ResponseDto/inscripcionResponseDTO';
import { grupoAlumnoDTOResponse } from '../../../models/dto/ResponseDto/grupoAlumnoDTOResponse';
import { ToastrService } from 'ngx-toastr';
import { GrupoService } from '../../../services/grupo.service';
import { grupoDTOResponse } from '../../../models/dto/ResponseDto/grupoDTOResponse';

@Component({
  selector: 'app-inicio-grupo-habilitado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio-grupo-habilitado.component.html',
  styleUrl: './inicio-grupo-habilitado.component.scss'
})
export class InicioGrupoHabilitadoComponent implements OnInit{
  idUsuario!:number;
  grupo!: grupoAlumnoDTOResponse;
  inscripcion!: InscripcionResponseDTO;
  mensajeError = '';
  grupoDeshabilitado!: grupoDTOResponse;

  constructor(private route : ActivatedRoute, private inscripcionService : InscripcionService, private router : Router, private toastr:ToastrService, private grupoService : GrupoService){}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
    const idInscripcionRuta = params['idInscripcion'];
    const idGrupoRuta = params['idGrupo'];

      if (!isNaN(Number(idInscripcionRuta)) && !isNaN(Number(idGrupoRuta))) {
        this.cargarInscripcion(Number(idInscripcionRuta));
        this.grupodeshabilitado(idGrupoRuta);
      } else {
        const user = JSON.parse(localStorage.getItem('user')!);
        this.idUsuario = user.id;
        this.cargargrupo();
      }
    });
  }

  //grupo habilitado
  cargargrupo(){
    this.inscripcionService.consultaGrupoAlumno(this.idUsuario).subscribe({
      next: (resp) => {
      this.grupo= resp;

      if (this.grupo?.idInscripcion) {
        this.cargarInscripcion(this.grupo.idInscripcion);
      }
    },
    error:(err)=>{
      if (err.status === 409) {
        const mensajeServidor = typeof err.error === 'string' ? err.error : err.error.message;
        //console.warn("Conflicto detectado:", mensajeServidor);
        this.mensajeError = mensajeServidor; 
      } else {
        this.mensajeError = "Ocurrió un error inesperado al consultar el grupo.";
      }
    }
    });
  }

  cargarInscripcion(id: number) {
    this.inscripcionService.consultaPorId(id).subscribe(data => {
      this.inscripcion = data;
    });
  }

  grupodeshabilitado(idGrupoRuta : number){
    this.grupoService.getGrupo(idGrupoRuta).subscribe({
      next: (resp) => {
      this.grupoDeshabilitado= resp;
    },
    error:(err)=>{
      if (err.status === 409) {
        const mensajeServidor = typeof err.error === 'string' ? err.error : err.error.message;
        //console.warn("Conflicto detectado:", mensajeServidor);
        this.mensajeError = mensajeServidor; 
      } else {
        this.mensajeError = "Ocurrió un error inesperado al consultar el grupo.";
      }
    }
    });    
  }
}

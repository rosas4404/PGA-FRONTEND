import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { sesionDTO } from '../../../models/dto/ResponseDto/sesionDTO';
import { sesionDetalleDTO } from '../../../models/dto/ResponseDto/sesionDetalleDTO';
import { Alcance } from '../../../models/enum/alcance';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SesionesService } from '../../../services/sesiones.service';
import { GrupoService } from '../../../services/grupo.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { grupoAlumnoDTOResponse } from '../../../models/dto/ResponseDto/grupoAlumnoDTOResponse';
import { InscripcionResponseDTO } from '../../../models/dto/ResponseDto/inscripcionResponseDTO';
import { sesionDetalleAlumnoDTO } from '../../../models/dto/ResponseDto/sesionDetalleAlumnoDTOResponse';

@Component({
  selector: 'app-sesiones-alumno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sesiones-alumno.component.html',
  styleUrl: './sesiones-alumno.component.scss'
})
export class SesionesAlumnoComponent implements OnInit{
  idUsuario!: number;
  idInscripcion!: number;
  idGrupo = 0;
  sesionSeleccionada! : sesionDTO;
  sesionDetalle! : sesionDetalleDTO;
  sesionAlumno : sesionDetalleAlumnoDTO[] = [];
  grupo!: grupoAlumnoDTOResponse;
  inscripcion!: InscripcionResponseDTO;

  public alcanceEnum = Alcance;

  //paginacion
    totalPages=0;
    page = 0;
    size = 6;
  
    //FILTRO DINAMICO
    filtroFormulario!: FormGroup;
    totalElements = 0;

    modalRef: any;

    constructor (private sesioneService: SesionesService, private inscripcionService:InscripcionService, private route : ActivatedRoute, private fb: FormBuilder, private modalService : NgbModal){}

    ngOnInit(): void {
      this.filtroFormulario = this.fb.group({
        idAlumno: [null],
        idGrupo: [null],
        momentoSesion: [null],
        alcance: [null]
      });

      this.idGrupo =  Number(this.route.parent?.snapshot.paramMap.get('idGrupo'));
      const user = JSON.parse(localStorage.getItem('user')!);
      this.idUsuario = user.id;
          
      this.inscripcionService.consultaGrupoAlumno(this.idUsuario).subscribe({
        next: (resp) => {
          this.idInscripcion = resp.idInscripcion;
          this.filtroFormulario.patchValue({
            idAlumno: this.idInscripcion,
            idGrupo: this.idGrupo
          });
            this.cargarSesiones();
        }
      });
    }


    cargarSesiones(){
      const valores = this.filtroFormulario.value;
    
      const filtrosLimpios = Object.fromEntries(// Elimina cualquier propiedad que sea null o undefined
        Object.entries(valores).filter(([_, v]) => v != null)
      );

      this.sesioneService.consultaAlumnoPage(this.idInscripcion, this.page, this.size, filtrosLimpios).subscribe({
        next: (resp:any) => {
          this.sesionAlumno = resp.content;
          this.totalPages = resp.totalPages;
        }
      });
    }
    
   get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
  
  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
    this.page = nuevaPagina;
    this.cargarSesiones();
  }

   //filtros
  buscar() {
    this.page=0;
    this.cargarSesiones();
  }

  limpiarFiltros() {
    this.filtroFormulario.reset({
      momentoSesion: '',
      alcance: ''
  });
    this.page = 0;
    this.cargarSesiones();
  }
}

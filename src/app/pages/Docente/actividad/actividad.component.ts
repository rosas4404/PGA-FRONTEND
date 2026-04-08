import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadGrupoService } from '../../../services/actividad-grupo.service';
import { actividadGrupoDashboardDTO } from '../../../models/dto/ResponseDto/actividadGrupoDashboardDTO';
import { CommonModule } from '@angular/common';
import { ActividadAlumnoService } from '../../../services/actividad-alumno.service';
import { actividadAlumnoDTOResponse } from '../../../models/dto/ResponseDto/actividadAlumnoDTOResponse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { cambiarEstadoTareaDTO } from '../../../models/dto/RequestDto/cambiarEstadoTareaDTO';


@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.scss'
})
export class ActividadComponent implements OnInit {
  idActividad = 0;
  actividad!:  actividadGrupoDashboardDTO
  asignaciones : actividadAlumnoDTOResponse [] = []
  nombreAlumno : string = "";
  nombreActividad : string = "";
  tituloAccion : string = "";
  accionTexto : string = "";

  idActividadAlumno = 0;
  formExentar! : FormGroup;
  
  constructor(
    private route : ActivatedRoute, 
    private actividadesGrupoService : ActividadGrupoService,
    private actividadAlumnoService : ActividadAlumnoService,
    private router : Router,
    private modalService : NgbModal,
    private toastr : ToastrService,
    private fb : FormBuilder
  ){}

  ngOnInit(): void {
    this.formExentar = this.fb.group({
    motivoExencion: ['', Validators.required]
  });
     this.idActividad =  Number(this.route.snapshot.paramMap.get('idActividad'));
     this.cargarActividad();
     this.cargarAsignaciones();
  }

  cargarActividad(){
    this.actividadesGrupoService.obtenerActividadPorId(this.idActividad).subscribe({
      next: (data) =>
      {
        this.actividad = data;
        console.log(this.actividad);
      }
    })
  }

  cargarAsignaciones(){
    this.actividadAlumnoService.obtenerAsignaciones(this.idActividad).subscribe({
      next : (data) =>{
        this.asignaciones = data;
        console.log(this.asignaciones)
      }
    })
  }
  
  AbrirConfirmacion(a: actividadAlumnoDTOResponse, content : any){
      this.nombreAlumno= a.nombre; 
      this.nombreActividad = this.actividad.titulo;
      this.idActividadAlumno = a.idActividadAlumno;
      this.accionTexto = `
          • Esta acción no se puede deshacer.
          • El alumno quedará exento permanentemente..
          `;
      this.formExentar.reset();
    
    const modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }
  exentar(modal: any){
    if (this.formExentar.invalid) {
    this.formExentar.markAllAsTouched();
    return;
    }
    const dto : cambiarEstadoTareaDTO = {
      estado : "Exenta", mensaje : this.formExentar.value.motivoExencion

    }
    this.actividadAlumnoService.exentarActividad(this.idActividadAlumno, dto)
    .subscribe({
      next: () => {
        this.toastr.success ('Estado actualizado correctamente');
        this.cargarActividad();
        this.cargarAsignaciones();
        modal.close();

      },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al cambiar estado');
        }
      });

  }
}

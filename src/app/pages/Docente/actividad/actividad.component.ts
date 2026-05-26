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
import baseUrl from '../../../services/helper';
import { InscripcionService } from '../../../services/inscripcion.service';
import { alumnoGrupoDTOResponse } from '../../../models/dto/ResponseDto/alumnoGrupoDTOResponse';
import { identifierName } from '@angular/compiler';
import { AgregarInscripcionesRequestDTO } from '../../../models/dto/RequestDto/agregarInscripcionesRequestDTO';
import { grupoDTOResponse } from '../../../models/dto/ResponseDto/grupoDTOResponse';
import { GrupoService } from '../../../services/grupo.service';


@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.scss'
})
export class ActividadComponent implements OnInit {
  idGrupo = 0;
  grupo!: grupoDTOResponse;
  idActividad = 0;
  actividad!:  actividadGrupoDashboardDTO
  asignaciones : actividadAlumnoDTOResponse [] = []
  nombreAlumno : string = "";
  nombreActividad : string = "";
  tituloAccion : string = "";
  accionTexto : string = "";

  idActividadAlumno = 0;
  formExentar! : FormGroup;

  asignacionSeleccionada! : actividadAlumnoDTOResponse;

  formCalificar! : FormGroup;

  calificacion :string [] = ["Aprobada", "Incompleta"]

  filtro : string  = 'TODOS';


  participantes : { nombre:string, id : number }[] = [];
  alumnosSeleccionados : number[] = [];
  disponibles : { nombre:string, id : number }[] = [];

  archivoSeleccionado : File | null = null;

  constructor(
    private route : ActivatedRoute, 
    private actividadesGrupoService : ActividadGrupoService,
    private actividadAlumnoService : ActividadAlumnoService,
    private router : Router,
    private modalService : NgbModal,
    private toastr : ToastrService,
    private fb : FormBuilder,
    private inscripcionService : InscripcionService,
    private grupoService : GrupoService
  ){}

  ngOnInit(): void {
    this.formExentar = this.fb.group({
    motivoExencion: ['', Validators.required]
    });

    this.formCalificar = this.fb.group({
      estado : ['', Validators.required],
      mensaje : ['', Validators.required]
    })
    this.idActividad =  Number(this.route.snapshot.paramMap.get('idActividad'));
    this.idGrupo =  Number(this.route.parent?.parent?.snapshot.paramMap.get('idGrupo'));
    console.log(this.idGrupo);
    this.cargarActividad();
    this.cargarAsignaciones();
    this.cargarGrupo();
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

  abrirDetalle(a : actividadAlumnoDTOResponse, content : any){
    this.asignacionSeleccionada = a;
     const modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }
  
  abrirConfirmacion(a: actividadAlumnoDTOResponse, content : any){
      this.asignacionSeleccionada = a;
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
        this.asignacionSeleccionada.estadoTarea = dto.estado;
        this.asignacionSeleccionada.excento = true;
        this.asignacionSeleccionada.motivoExencion = dto.mensaje;
        modal.close();

      },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al cambiar estado');
        }
      });

  }

  descargarEntrega(idActividadAlumno : number){
    window.open(`${baseUrl}/actividades-alumnos/${idActividadAlumno}/entrega`, '_blank');
  }

  abrirCalificarEntrega(a : actividadAlumnoDTOResponse, content : any){
    this.asignacionSeleccionada = a;
    this.formCalificar.reset({
      estado : "",
      mensaje: a.observaciones || ''
  });
    const modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  calificarEntrega(modal: any){
    if (this.formCalificar.invalid) {
      this.formCalificar.markAllAsTouched();
    return;
    }
    const dto : cambiarEstadoTareaDTO = {
      estado : this.formCalificar.value.estado , mensaje : this.formCalificar.value.mensaje
    }
    this.actividadAlumnoService.calificarEntrega(this.asignacionSeleccionada.idActividadAlumno, dto).subscribe({
      next : () => {
        this.toastr.success ('Estado actualizado correctamente');
        this.cargarActividad();
        this.asignacionSeleccionada.estadoTarea = dto.estado;
        this.asignacionSeleccionada.observaciones= dto.mensaje;
        
        modal.close();
      },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al cambiar estado');
        }
      
    })
  }

  cambiarFiltro(f : string){
    this.filtro = f;
  }
  asignacionesFiltradas() {
    return this.asignaciones.filter(a => {
      switch(this.filtro){
        case 'ENTREGADAS':
          return a.estadoTarea == 'Completada';
        case 'EXENCIONES':
          return a.estadoTarea == 'Exenta'
        case 'APROBADAS':
          return a.estadoTarea == 'Aprobada'
        case 'INCOMPLETAS':
          return a.estadoTarea == 'Incompleta'
          case 'NOINICIADAS':
          return a.estadoTarea == 'Sin_Iniciar'
        case 'ESPERA':
          return a.estadoTarea == 'En_Espera'
        case 'PROGRESO':
          return a.estadoTarea == 'En_Progreso'
        default:
          return true;
      }
    })
  }

  volver(){
  this.router.navigate(['../'], { relativeTo: this.route });
}

  abrirModalAsignar(content : any){
    this.cargarAlumnosPorGrupo(this.idGrupo);
    this.alumnosSeleccionados =  [];
    const modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  
  }

  cargarAlumnosPorGrupo(idGrupo: number) {
    
    this.inscripcionService.obtenerAlumnosPorGrupoGeneral(idGrupo).subscribe({
      next: (data) => {
        this.participantes = data.map((a: alumnoGrupoDTOResponse) => ({
          id: a.idInscripcion,
          nombre: `${a.nombre} ${a.apellidoPaterno} ${a.apellidoMaterno}`
             
      }));
        this.obtenerAlumnosDisponibles();
       
      },
      error: () => this.participantes = []
    });
  }
  obtenerAlumnosDisponibles() {
  this.disponibles = this.participantes.filter(alumno =>
    !this.asignaciones.some(a => a.idInscripcion === alumno.id)
  );
}
seleccionAlumno( id: number, event : any){
  if (event.target.checked) {
    this.alumnosSeleccionados.push(id);
  } else {
    this.alumnosSeleccionados = this.alumnosSeleccionados
      .filter(id => id !== id);
  }
}
asignar(modal : any){
  const dto : AgregarInscripcionesRequestDTO = {idsInscripciones: this.alumnosSeleccionados};

  this.actividadesGrupoService.agregarInscripciones(this.actividad.idActividadGrupo, dto).subscribe({
    next: (data)=>{
      this.toastr.success ('Tarea asignada correctamente');
        this.cargarAsignaciones();
        modal.close();
    },
    error : (err) =>{
      this.toastr.error(err.error.message || 'Error al cambiar estado');
    }
  })
}

abrirModal(content : any){
  this.archivoSeleccionado = null;
   const modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
}
onFileSelected(event: any){
    const archivo: File = event.target.files[0]; // Obtenemos el primer archivo seleccionado
    const maxSize = 2 * 1024 * 1024; // 2MB (2 * 1024 KB * 1024 B)
    const tiposPermitidos = ['application/pdf'];

    //validacion de que no exceda el peso 
    if (!archivo) return; //si no hay archivo sale
    // Validar Tipo (Formato)
    if (!tiposPermitidos.includes(archivo.type)) {
      this.toastr.error('Error: Solo se permiten archivos PDF');
      event.target.value = '';
      return; 
    }

    // Validar Tamaño
    if (archivo.size > maxSize) {
      this.toastr.error('El archivo es demasiado grande. Máximo 2MB.');
      event.target.value = '';
      return; 
    }
      
    if (archivo) {
      // Si seleccionó un archivo, procedemos a subirlo
      this.archivoSeleccionado = archivo;

    } else {
      
      this.toastr.warning('No se seleccionó ningún archivo');
    }
    
     event.target.value = '';

}
actualizar(modal : any){

  this.actividadesGrupoService.actualizarInstrucciones(this.actividad.idActividadGrupo, this.archivoSeleccionado).subscribe({
    next: (data) =>{
      this.toastr.success("Actividad actualizada con exito", "Éxito");
      this.cargarActividad();
      modal.close();
    },
    error: (err) =>{
      this.toastr.error('Ocurrió un error al actualizar' + err.message, 'Error');
    }
  })
}
verInstrucciones(idActividadGrupo: number){
  this.actividadesGrupoService.verInstrucciones(idActividadGrupo).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  cargarGrupo(){
    this.grupoService.getGrupo(this.idGrupo).subscribe({
      next: (data) =>{
        this.grupo = data;
      } 
    })
  }

}


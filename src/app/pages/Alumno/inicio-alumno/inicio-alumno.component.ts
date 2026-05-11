import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { usuarioDTOResponse } from '../../../models/dto/ResponseDto/usuarioDTOResponse';
import { UsuarioService } from '../../../services/usuario.service';
import { LoginService } from '../../../services/login.service';
import { ReporteService } from '../../../services/reporte.service';
import { SeguimientoSemanalService } from '../../../services/seguimiento-semanal.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { SeguimientoDashboardResponseDto } from '../../../models/dto/ResponseDto/SeguimientoDashboardResponseDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SemanaResponseDto } from '../../../models/dto/ResponseDto/SemanaResponseDto';
import { ToastrService } from 'ngx-toastr';
import { ActividadAlumnoDto } from '../../../models/dto/actividadAlumnoDto';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './inicio-alumno.component.html',
  styleUrl: './inicio-alumno.component.scss'
})
export class InicioAlumnoComponent implements OnInit{
  @ViewChild('modalRecordatorio')
  modalRecordatorio!: TemplateRef<any>;

  saludo: string = '';
  idUsuario : number = 0;
  usuarioActual! : usuarioDTOResponse;
  fechaActual! : Date;

  mesActual!: number;
  anioActual!: number;
  mesBase!: number;
  anioBase!: number;
    diasMes: (Date | null) [] = [];
    diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  hoverDia: Date | null = null;

  idInscripcion: number = 0;
  mensajeError = '';
  semanaActual : SeguimientoDashboardResponseDto | null = null;


  proximoDomingo: Date = new Date();
  modalRef:any;

  sugeridos! : ActividadAlumnoDto[]

  actividadesDisponibles: ActividadAlumnoDto[] = [];

  seleccionadas: ActividadAlumnoDto[] = [];

  constructor(
    private usuarioService : UsuarioService, 
    private loginService : LoginService, 
    private router : Router, 
    private reporteService : ReporteService,
    private seguimientoSemanalService : SeguimientoSemanalService,
    private inscripcionService : InscripcionService,
    private modalService : NgbModal,
    private toastr : ToastrService
  ){}

  ngOnInit(): void {
    this.fechaActual = new Date();
    this.mesActual = this.fechaActual.getMonth();
    this.anioActual = this.fechaActual.getFullYear();
    this.mesBase = this.mesActual;
    this.anioBase = this.anioActual;
    const diasFaltantes = this.fechaActual.getDay() === 0 ? 0 : 7 - this.fechaActual.getDay();
    this.proximoDomingo.setDate(this.fechaActual.getDate() + diasFaltantes);
    this.saludo = this.getSaludo();
    this.cargarUsuarioActual();
    
  }

  cargarUsuarioActual(){
    this.loginService.getCurrentUser().subscribe({
      next : (data) => { 
        this.idUsuario = data.id;
        this.usuarioService.obtenerUsuarioId(this.idUsuario).subscribe({
          next: (data)=>{
            this.usuarioActual = data;
            this.cargarInscripcionActual(this.usuarioActual.idUsuario);
          }
        });

      } 
    });

  }
  cargarInscripcionActual(idUsuario: number){
    this.inscripcionService.consultaGrupoAlumno(idUsuario).subscribe({
        next: (resp) => {
          this.idInscripcion = resp.idInscripcion;
          this.cargarSemanaActual(this.idInscripcion);
        }, error: (err) => {
            if (err.status === 409) {
              this.mensajeError = err.error?.message || 'El alumno no cuenta con inscripciones activas';
            } 
        }
    });
  }
  cargarSemanaActual(id : number){
   this.seguimientoSemanalService.obtenerSemanaActual(id).subscribe({
    next: (data) =>{
      this.semanaActual = data;
      
      if(!this.semanaActual){
        this.abrirModalRecordatorio();
      }
    }, 
    error: (err)=>{
      if(err.status === 404){
        this.abrirModalRecordatorio();
      }

      
    }
   });
  }
  getSaludo(): string {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) {
      return 'Buenos días';
    } else if (hora >= 12 && hora < 19) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  convertirFecha(fechaStr: string): Date {
    const [fecha, hora] = fechaStr.split(' ');
    const [dia, mes, anio] = fecha.split('/');

    return new Date(
      Number(anio),
      Number(mes) - 1, // meses empiezan en 0
      Number(dia),
      Number(hora.split(':')[0]),
      Number(hora.split(':')[1])
    );
  }

  formatearHora(fechaStr: string): string {
    const fecha = this.convertirFecha(fechaStr);
    return fecha.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  descargarReporteUsuarios(){

      this.reporteService.generarReporteUsuarios().subscribe((blob: Blob) => {
      // Creamos un link temporal en el DOM
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = `reporte_usuarios.pdf`; 
      
      document.body.appendChild(a);
      a.click();
      
      // Limpieza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error("Error al descargar el PDF", error);
    });
  }

  descargarReporteExpedientes(){

    this.reporteService.generarReporteExpediente().subscribe((blob: Blob) => {
      // Creamos un link temporal en el DOM
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = `reporte_expedientes.pdf`; 
      
      document.body.appendChild(a);
      a.click();
      
      // Limpieza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error("Error al descargar el PDF", error);
    });
  }

  irALista(){
    this.router.navigate(['usuarios/alumnos']);
  }


  abrirModalRecordatorio(){
    this.modalRef = this.modalService.open(this.modalRecordatorio, {
      centered: true,
      backdrop: 'static',
      keyboard: false
      });
      this.modalRef.result.finally(() => {
        this.cerrarModal();
      });
  }

  cerrarModal(){
    this.modalRef?.dismiss();
  }


  crearSemana(modal : any){
    this.seguimientoSemanalService.crearSemana (this.idInscripcion).subscribe({
      next: data =>{
        this.sugeridos = data.actividadesSugeridas;
        this.semanaActual = { 
          idSeguimientoSemanal: data.idSeguimientoSemanal,
          numeroSemana : data.numeroSemana,
          semanaInicio : data.semanaInicio,
          semanaFin : data.semanaFin,
          fechaLimiteEdicion : data.fechaLimiteEdicion,
          porcentajeAvance : data.porcentajeAvance,
          detalles: []
        }

        this.abrirModalCrear(modal)
      },
      error: err =>{
        this.toastr.error(  err.error.message || "Error al crear semana" , 'Error' )
      }
    });
  }

  abrirModalCrear(modal: any){
    if (this.modalRef){
      this.cerrarModal();
    }
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      keyboard: false
      });
      this.modalRef.result.finally(() => {
        this.cerrarModal();
      });
  }
}

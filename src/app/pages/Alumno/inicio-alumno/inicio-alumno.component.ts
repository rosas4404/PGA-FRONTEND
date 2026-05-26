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
import { FormsModule } from '@angular/forms';
import { ActividadAlumnoService } from '../../../services/actividad-alumno.service';
import { actividadAlumnoListaDTO } from '../../../models/dto/ResponseDto/actividadAlumnoListaDTO';
import { DetalleSeguimientoAgrupadoDto } from '../../../models/dto/RequestDto/DetalleSeguimientoAgrupadoDto';
import { DetalleSemanalService } from '../../../services/detalle-semanal.service';
import { DetalleDashboardDto } from '../../../models/dto/ResponseDto/DetalleDashboardDto';
import { DetalleSeguimientoRequestDto } from '../../../models/dto/RequestDto/DetalleSeguimientoRequestDto';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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

  sugeridos : ActividadAlumnoDto[] = []

  actividadesDisponibles: actividadAlumnoListaDTO[] = [];

  seleccionadas: ActividadAlumnoDto[] = [];
  actividadSeleccionada : ActividadAlumnoDto | null = null;
  detalleSeleccionado : DetalleDashboardDto | null = null;
  estadoSeleccionado: string = "SIN INICIAR";
  incrementoSeleccionado: number = 0;
  observaciones: string = '';

  mostrarOtro = false;
  otroIncremento: number | null = null;

  constructor(
    private usuarioService : UsuarioService, 
    private loginService : LoginService, 
    private router : Router, 
    private reporteService : ReporteService,
    private seguimientoSemanalService : SeguimientoSemanalService,
    private inscripcionService : InscripcionService,
    private actividadAlumnoService : ActividadAlumnoService,
    private modalService : NgbModal,
    private toastr : ToastrService,
    private detalleService : DetalleSemanalService
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
      if (!data) {
        this.semanaActual = null;
        this.abrirModalRecordatorio();
        return;
      }
      this.semanaActual = data;
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
    this.modalRef?.close();
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
        this.cerrarModal();
        setTimeout(() => {
          this.abrirModalCrear(modal);
        }, 150);

      },
      error: err =>{
        this.toastr.error(  err.error.message || "Error al crear semana" , 'Error' )
      }
    });
  }

  abrirModalCrear(modal: any){
    this.cargarActividadesDisponibles();
    this.seleccionadas = [];
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      keyboard: false
      });
      this.modalRef.result.finally(() => {
        this.cerrarModal();
      });
  }

  cargarActividadesDisponibles(){
    this.actividadAlumnoService.obtenerActividadesPorInscripcionDisponibles(this.idInscripcion).subscribe({
      next: data=>{
        this.actividadesDisponibles = data;
      }
    });
  }
  get actividadesFiltradas() {

    return this.actividadesDisponibles.filter(a => {
      const esSugerida = this.sugeridos.some(
      s => s.idActividadAlumno === a.idActividadAlumno
    );

    const yaSeleccionada = this.seleccionadas.some(
      s => s.idActividadAlumno === a.idActividadAlumno
    );
    const yaRegistrada = this.semanaActual?.detalles.some(
      d => d.idActividadAlumno === a.idActividadAlumno
    );

    return !esSugerida && !yaSeleccionada && !yaRegistrada ;

  });
}

  seleccionarActividad(actividad: ActividadAlumnoDto) {
    const existe = this.seleccionadas.some( a => a.idActividadAlumno === actividad.idActividadAlumno);

    if (existe) { 
      this.seleccionadas = this.seleccionadas.filter( a => a.idActividadAlumno !== actividad.idActividadAlumno);

    } else {
        this.seleccionadas.push(actividad);
    }
  }
  agregarActividad(){
    if (!this.actividadSeleccionada) return;

    const registrada =  this.semanaActual?.detalles.some(d=>{
      return d.idActividadAlumno === this.actividadSeleccionada?.idActividadAlumno;
    })
    const existe = this.seleccionadas.some(
      a => a.idActividadAlumno === this.actividadSeleccionada?.idActividadAlumno
    );

    if (!existe && !registrada) {
      this.seleccionadas.push(this.actividadSeleccionada);
    }
    this.actividadSeleccionada = null;
  }

  eliminarActividad(actividad : ActividadAlumnoDto){
    if (!actividad) return;
    
    this.seleccionadas = this.seleccionadas.filter(
      a => a.idActividadAlumno !== actividad.idActividadAlumno
    );
  }

  registrarActividades(){

    const actividades = this.seleccionadas.map(a => ({
    idActividad: a.idActividadAlumno , estadoSemana: 'SIN INICIAR'
    }));
    
    
    const dto : DetalleSeguimientoAgrupadoDto = {
      idSemana : this.semanaActual?.idSeguimientoSemanal || 0,
      actividades : actividades
    }
    
    this.detalleService.crearDetalle(dto).subscribe({
      next: data=>{
        this.toastr.success("Actividades registradas con éxito", 'ÉXITO')
        this.cargarUsuarioActual();
        this.cerrarModal();

      },
      error : err =>{
        this.toastr.error(err.error.message || "Error al registrar activiades", 'Error')
        this.cerrarModal();
      }
    })

  }

  cerrarCrear(){
    this.modalRef?.dismiss();
    this.seleccionadas = [];

  }

abrirModalActualizar( modal: any, detalle: DetalleDashboardDto) {
  this.detalleSeleccionado = detalle;
  this.estadoSeleccionado = detalle.estadoSemana.replace("_", " ").toUpperCase() ?? 'SIN INICIAR';
  this.incrementoSeleccionado = 0;
  this.observaciones = detalle.observacionesAlumno ?? '';

  this.modalRef = this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      keyboard: false
      });
      this.modalRef.result.finally(() => {
        this.cerrarModal();
      });
}

seleccionarIncremento(valor: number){

  this.mostrarOtro = false;
  this.otroIncremento = null;
if(this.detalleSeleccionado){
  const avanceActual = this.detalleSeleccionado?.avanceGlobalActividad;
  const limite =  this.detalleSeleccionado?.requiereEntrega? 99: 100;
  const restante = limite - avanceActual;
  
  if (valor > restante) {
    this.incrementoSeleccionado = restante;
    return;
  }
  this.incrementoSeleccionado = valor;
  }
}

guardarActualizacion(): void {
  if (!this.detalleSeleccionado) return;
  const dto : DetalleSeguimientoRequestDto = {
    idActividad : this.detalleSeleccionado.idActividadAlumno,
    estadoSemana: this.estadoSeleccionado,
    avanceReal: this.incrementoSeleccionado,
    observacionesAlumno: this.observaciones
  };
  this.detalleService.actualizarDetalle(this.detalleSeleccionado.idDetalleSeguimiento , dto ).subscribe({
    next : (data)=>{
      this.cargarUsuarioActual();
      this.cerrarModal();
      this.toastr.success("Actualización exitosa",'Éxito')

    }, 
    error : (err) =>{
      this.toastr.error(err.error.message ||  "Error al actualizar", 'Error')
      this.cerrarModal();
    }
  })

 }

 aplicarOtroIncremento() {

  if (this.otroIncremento == null) return;
  this.seleccionarIncremento(this.otroIncremento);

}

marcarCompletada (detalle : DetalleDashboardDto) {
  const dto : DetalleSeguimientoRequestDto = {
  idActividad : detalle.idActividadAlumno,
  estadoSemana: detalle.estadoSemana.replace("_", " ").toUpperCase(),
  avanceReal: detalle.avanceEsperado,
  observacionesAlumno: ''
  };
  this.detalleService.actualizarDetalle(detalle.idDetalleSeguimiento , dto ).subscribe({
    next : (data)=>{
      this.cargarUsuarioActual();
      this.toastr.success("Actualización exitosa",'Éxito')

    }, 
    error : (err) =>{
      this.toastr.error(err.error.message ||  "Error al actualizar", 'Error')
    }
  })

}
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InscripcionService } from '../../../services/inscripcion.service';
import { GrupoService } from '../../../services/grupo.service';
import { SesionesService } from '../../../services/sesiones.service';
import { ActivatedRoute } from '@angular/router';
import { sesionAlumnoDetalleDTO } from '../../../models/dto/ResponseDto/sesionAlumnoDetalleDTO';
import { alumnoGrupoDTOResponse } from '../../../models/dto/ResponseDto/alumnoGrupoDTOResponse';
import { Alcance } from '../../../models/enum/alcance';
import { grupoDTODashboardResponse } from '../../../models/dto/ResponseDto/grupoDTODashboardResponse';
import { sesionDocenteDTOResponse } from '../../../models/dto/ResponseDto/sesionDocenteDTOResponse';
import { sesionDetalleDTO } from '../../../models/dto/ResponseDto/sesionDetalleDTO';
import { sesionDTO } from '../../../models/dto/ResponseDto/sesionDTO';
import { sesionDTORequest } from '../../../models/dto/RequestDto/sesionDTORequest';
import { sesionUpdateDTO } from '../../../models/dto/RequestDto/sesionUpdateDTO';
import { asistenciaDTORequest } from '../../../models/dto/RequestDto/asistenciaDTORequest';
import { EstadoAsistencia } from '../../../models/enum/EstadoAsistencia';
@Component({
  selector: 'app-sesion-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './sesion-grupo.component.html',
  styleUrl: './sesion-grupo.component.scss'
})
export class SesionGrupoComponent implements OnInit{
  idGrupo : number = 0;
  sesionSeleccionada! : sesionDTO;
  sesionDetalle! : sesionDetalleDTO;
  sesionDocente : sesionDocenteDTOResponse[] =[];
  grupos: grupoDTODashboardResponse[] = [];
  asistenciaTomar! : asistenciaDTORequest;

  sesionForm!: FormGroup;
  idUsuario!:number;
  asistenciaForm!: FormGroup;
  
  esIndividual = false;
  alumnos: alumnoGrupoDTOResponse[] = []; // se cargan alumnos
  idsSeleccionados: number[] = [];

  alumnosDetalle: sesionAlumnoDetalleDTO[]=[];
  public alcanceEnum = Alcance;

  estadoAsistencia = [{value: 'ASISTIO', label:'ASISTIO'},{value:'FALTO', label:'FALTO'}, {value:'RETARDO', label:'RETARDO'}];

  //paginacion
  totalPages=0;
  page = 0;
  size = 6;

  //FILTRO DINAMICO
  filtroFormulario!: FormGroup;
  totalElements = 0;

  modalRef: any;
  modo: 'crear' | 'ver' | 'editarSesion' | 'consultaAsistencia' | 'tomarAsistencia' |'editarAlumnos' = 'crear';

  minFecha = new Date().toISOString().slice(0,16);

  constructor (private sesioneService: SesionesService, private grupoService: GrupoService, private inscripcionService:InscripcionService, private route : ActivatedRoute, private fb: FormBuilder, private toastr: ToastrService, private modalService: NgbModal){}

  ngOnInit(): void {
    this.idGrupo =  Number(this.route.parent?.snapshot.paramMap.get('idGrupo'));
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .?=-]*)*\/?$/;

    this.sesionForm = this.fb.group({
      fecha : ['', Validators.required],
      tema : ['', Validators.required],
      urlSesion: ['', [Validators.required, Validators.pattern(urlPattern)]],
      alcance: ['', Validators.required],
      plataforma:['', Validators.required],
      idGrupo:this.idGrupo,
      idsInscripcion:[[]]
    })

    this.asistenciaForm = this.fb.group({
      asistencias:this.fb.array([])
    });

    this.filtroFormulario = this.fb.group({
      idocente : this.idUsuario,
      idGrupo : this.idGrupo,
      momentoSesion: [null],
      alcance: [null]
    });

    this.sesionForm.get('idGrupo')?.valueChanges.subscribe(idGrupo => {
      if (idGrupo) {
      this.cargarAlumnosPorGrupo(idGrupo);
      }
    });

    this.cargarGrupos();
    this.cargarSesiones();
  }


  cargarSesiones(){
    const valores = this.filtroFormulario.value;
  
    // Elimina cualquier propiedad que sea null o undefined
    const filtrosLimpios = Object.fromEntries(
      Object.entries(valores).filter(([_, v]) => v != null)
    );

    this.sesioneService.consultaGeneralPage(this.idUsuario, this.page, this.size, filtrosLimpios).subscribe((resp:any) =>{
      this.sesionDocente = resp.content;
      this.totalPages = resp.totalPages;
    });
  }

  cargarAlumnosPorGrupo(idGrupo: number) {
    this.alumnos = [];
    this.inscripcionService.obtenerAlumnosPorGrupo(idGrupo).subscribe({
      next: (data) => this.alumnos = data,
      error: () => this.alumnos = []
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

  onChangeAlcance() {
    const alcance = this.sesionForm.get('alcance')?.value;
    this.esIndividual = alcance === 'INDIVIDUAL';

    if (!this.esIndividual) {
      this.idsSeleccionados = [];
    }
  }

  onAlumnoSeleccionado(event: any) {
    const id = +event.target.value;

    if (event.target.checked) {
      this.idsSeleccionados.push(id);
    } else {
      this.idsSeleccionados =
        this.idsSeleccionados.filter(x => x !== id);
    }
  }
  

  nuevaSesion() {
    this.modo = 'crear';
    this.esIndividual = false;
    this.idsSeleccionados = [];
    this.sesionForm.enable();
    this.sesionForm.reset({ alcance: 'GRUPAL' });
  }

  normalizarUrl(url: string): string | null {
    if(!url) return null;
    const urlLimpia = url.trim();//limpia espacios en blanco a los extremos
    //expresion regular para validar estructura de url (dominio mas la extension)
    //valida que tenga un formato tipo:ddd.com
    const urlRegEx = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .?=-]*)*\/?$/;
    if(!urlRegEx.test(urlLimpia)){
      this.toastr.warning('Formato incorrecto. Ingresar url válida');
      return null;
    }
    if (!urlLimpia.startsWith('http://') && !urlLimpia.startsWith('https://')) {
      return `https://${urlLimpia}`;
    }
    return urlLimpia;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);

    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();

    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }

  guardar(modal:any){
    if (this.sesionForm.invalid && this.modo !== 'editarAlumnos') {
      this.sesionForm.markAllAsTouched();
      return;
    }

    const formValue = this.sesionForm.getRawValue();
    const fechaFormateada = this.formatearFecha(formValue.fecha);
    const idSesion = this.sesionDetalle?.idSesion;

    if(this.modo === 'crear'|| this.modo === 'editarSesion'){
      if (new Date(formValue.fecha) <= new Date()) {
        this.toastr.warning('La fecha y hora deben ser posterior a la actual');
        return;
      }

      const idGrupoFinal = Number(this.idGrupo); 

      if (this.modo === 'crear') {
        const payload: sesionDTORequest = {
          ...formValue,
          idGrupo: idGrupoFinal,
          fecha: fechaFormateada,
          urlSesion: this.normalizarUrl(formValue.urlSesion),
          idsInscripcion: this.esIndividual ? this.idsSeleccionados : []
        };
        this.ejecutarSuscripcion(this.sesioneService.crearSesion(idGrupoFinal, payload), modal);
      } else {
        const payload: sesionUpdateDTO = {
          ...formValue,
          fecha: fechaFormateada,
          urlSesion: this.normalizarUrl(formValue.urlSesion)
        };
        this.ejecutarSuscripcion(this.sesioneService.actualizarDetalleSesion(idSesion, payload), modal);
      }
    } else if(this.modo === 'editarAlumnos'){
      if (this.esIndividual && this.idsSeleccionados.length === 0) {
        this.toastr.warning('Selecciona al menos un alumno');
        return;
      }
      this.ejecutarSuscripcion(this.sesioneService.actualizarInscripciones(idSesion, this.idsSeleccionados), modal);
    }
  }

  private ejecutarSuscripcion(obs: any, modal: any) {
    obs.subscribe({
      next: () => {
        this.toastr.success('Operación exitosa');
        this.cargarSesiones();
        modal.close();
      },
      error: (err: any) => this.toastr.error(err.error?.message || 'Error en el servidor')
    });
  }

  cargarGrupos(){
    this.grupoService.ActivosPorDocente(this.idUsuario)
      .subscribe(data => this.grupos = data);
  }

  editar(id:number, modal:any){
    this.abrirModal(modal);
    this.cargarSesion(id, 'ver', modal);
  }

  get formularioAsistenciaInvalido(): boolean {
    const asistencias = this.asistenciaForm.value.asistencias;
    return asistencias.some((a: any) => 
      !a.estado || a.estado === 'SIN_INICIAR'
    );
  }

  cargarFormularioAsistencia(){
    const control = this.asistenciaForm.get('asistencias') as FormArray;
    control.clear();

    this.alumnosDetalle.forEach(alumno => {
      let estadoInicial : EstadoAsistencia | null = null;

      if(alumno.estadoAsistencia && alumno.estadoAsistencia !== EstadoAsistencia.SIN_INICIAR){
        estadoInicial = alumno.estadoAsistencia;
      }

      control.push(this.fb.group({
        idSesionAlumno: [alumno.idSesionAlumno],
        estado: [estadoInicial, Validators.required]
      }));
    });

    this.asistenciaForm.updateValueAndValidity();
  }

  prepararAsistencia(id: number, modal: any) {
    this.sesioneService.obtenerDetallesSesion(id).subscribe(sesion => {
      this.sesionDetalle = sesion;
      this.alumnosDetalle = sesion.alumnos;
      this.modo = 'tomarAsistencia';
      this.cargarFormularioAsistencia(); 
      this.abrirModal(modal);
    });
  }
  
  asistencia(id: number, modo: 'tomarAsistencia', modal: any){
    
    const formValue: asistenciaDTORequest[]=this.asistenciaForm.value.asistencias;
    
    const sinSeleccionar = formValue.some(a => !a.estado || a.estado  === EstadoAsistencia.SIN_INICIAR);

    if (sinSeleccionar) {
      this.toastr.warning('Seleccionar el estado de todos los alumnos');
      this.asistenciaForm.markAllAsTouched();
      return;
    }

    

    this.sesioneService.tomarAsistencia(id, formValue).subscribe({
            next: () => {
              console.log(formValue);
              this.toastr.success('Éxito', 'Asistencia registrada correctamente');
              this.cargarSesiones();
              modal.close();
            },
            error: (err)=>{
              this.toastr.error(err.error.message || 'err', 'Error en el registro');
            }});
  }

  cargarSesion(id: number, modo: 'ver' | 'editarSesion' | 'editarAlumnos'| 'consultaAsistencia', modal: any) {
    this.sesioneService.obtenerDetallesSesion(id).subscribe(sesion => {
      this.sesionDetalle = sesion;
      this.alumnosDetalle = sesion.alumnos;
      this.modo = modo;
      this.esIndividual = sesion.alcance === this.alcanceEnum.INDIVIDUAL;
      this.idsSeleccionados = sesion.alumnos.map((a: any) => a.idInscripcion);

      // Resetear y parchar valores
      this.sesionForm.reset();
      this.sesionForm.patchValue({
        idGrupo: sesion.grupo.idGrupo,
        fecha: this.convertirFechaParaInput(sesion.fecha),
        alcance: sesion.alcance,
        plataforma: sesion.plataforma,
        tema: sesion.tema,
        urlSesion: sesion.url
      });

      // Gestión de estados de los controles
      if (modo === 'ver' || modo === 'editarAlumnos') {
        this.sesionForm.disable();
      } else if (modo === 'editarSesion') {
        this.sesionForm.enable();
        this.sesionForm.get('idGrupo')?.disable(); 
        this.sesionForm.get('alcance')?.disable(); 
      }

      if (modo === 'editarAlumnos' || this.esIndividual) {
        const idGrupo = sesion.grupo?.idGrupo!;
        this.cargarAlumnosPorGrupo(idGrupo);
      }

      this.abrirModal(modal);
    });
  }

  // Función auxiliar para el formato de fecha del input
  convertirFechaParaInput(fechaStr: string): string {
    if (!fechaStr) return '';
    // Convierte "29/03/2026 18:30" a "2026-03-29T18:30"
    const [f, h] = fechaStr.split(' ');
    const [d, m, a] = f.split('/');
    return `${a}-${m}-${d}T${h}`;
  }

  cancelar() {
    this.modo = 'crear';
    this.sesionForm.reset();
    this.sesionForm.enable();
  }

  cerrarModal(modal:any){
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }

  abrirModal(content: any) {
    this.modalRef  = this.modalService.open(content, {
      //size:'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }  
}

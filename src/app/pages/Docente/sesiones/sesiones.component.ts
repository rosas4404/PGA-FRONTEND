import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { sesionDTO } from '../../../models/dto/ResponseDto/sesionDTO';
import { SesionesService } from '../../../services/sesiones.service';
import { ToastrService } from 'ngx-toastr';
import { sesionDocenteDTOResponse } from '../../../models/dto/ResponseDto/sesionDocenteDTOResponse';
import { sesionDTORequest } from '../../../models/dto/RequestDto/sesionDTORequest';
import { GrupoService } from '../../../services/grupo.service';
import { grupoDTODashboardResponse } from '../../../models/dto/ResponseDto/grupoDTODashboardResponse';
import { alumnoGrupoDTOResponse } from '../../../models/dto/ResponseDto/alumnoGrupoDTOResponse';
import { InscripcionService } from '../../../services/inscripcion.service';
import { sesionDetalleDTO } from '../../../models/dto/ResponseDto/sesionDetalleDTO';
import { sesionAlumnoDetalleDTO } from '../../../models/dto/ResponseDto/sesionAlumnoDetalleDTO';
import { sesionUpdateDTO } from '../../../models/dto/RequestDto/sesionUpdateDTO';
import { Alcance } from '../../../models/enum/alcance';

@Component({
  selector: 'app-sesiones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './sesiones.component.html',
  styleUrl: './sesiones.component.scss'
})
export class SesionesComponent implements OnInit{

  sesionSeleccionada! : sesionDTO;
  sesionDetalle! : sesionDetalleDTO;
  sesionDocente : sesionDocenteDTOResponse[] =[];
  grupos: grupoDTODashboardResponse[] = [];

  sesionForm!: FormGroup;
  idUsuario!:number;
  
  esIndividual = false;
  alumnos: alumnoGrupoDTOResponse[] = []; // se cargan alumnos
  idsSeleccionados: number[] = [];

  alumnosDetalle: sesionAlumnoDetalleDTO[]=[];
  alcanceEnum = Alcance;

  //paginacion
  totalPages=0;
  page = 0;
  size = 3;

  //FILTRO DINAMICO
  filtroFormulario!: FormGroup;
  totalElements = 0;

  modalRef: any;
  modo: 'crear' | 'ver' | 'editarSesion' | 'editarAlumnos' = 'crear';

  minFecha = new Date().toISOString().slice(0,16);

  constructor (private sesioneService: SesionesService, private grupoService: GrupoService, private inscripcionService:InscripcionService, private fb: FormBuilder, private toastr: ToastrService, private modalService: NgbModal){}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;

    this.sesionForm = this.fb.group({
      fecha : ['', Validators.required],
      tema : ['', Validators.required],
      urlSesion: ['', Validators.required],
      alcance: ['', Validators.required],
      plataforma:['', Validators.required],
      idGrupo:['', Validators.required],
      idsInscripcion:[[]]
    })

    this.filtroFormulario = this.fb.group({
      idocente : this.idUsuario,
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

  normalizarUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
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

      if (this.modo === 'crear') {
        const payload: sesionDTORequest = {
          ...formValue,
          fecha: fechaFormateada,
          urlSesion: this.normalizarUrl(formValue.urlSesion),
          idsInscripcion: this.esIndividual ? this.idsSeleccionados : []
        };
        this.ejecutarSuscripcion(this.sesioneService.crearSesion(formValue.idGrupo, payload), modal);
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

  cargarSesion(id: number, modo: 'ver' | 'editarSesion' | 'editarAlumnos', modal: any) {
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
    modal.dismiss();
  }

  abrirModal(content: any) {
    this.modalRef  = this.modalService.open(content, {
      //size:'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    this.modalRef.result.finally(() => {
      this.cerrarModal(content);
    });
  }
}

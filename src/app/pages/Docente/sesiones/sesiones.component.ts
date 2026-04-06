import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SesionesService } from '../../../services/sesiones.service';
import { ToastrService } from 'ngx-toastr';
import { sesionDTORequest } from '../../../models/dto/RequestDto/sesionDTORequest';
import { GrupoService } from '../../../services/grupo.service';
import { grupoDTODashboardResponse } from '../../../models/dto/ResponseDto/grupoDTODashboardResponse';
import { alumnoGrupoDTOResponse } from '../../../models/dto/ResponseDto/alumnoGrupoDTOResponse';
import { InscripcionService } from '../../../services/inscripcion.service';
import { Alcance } from '../../../models/enum/alcance';

@Component({
  selector: 'app-sesiones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './sesiones.component.html',
  styleUrl: './sesiones.component.scss'
})
export class SesionesComponent implements OnInit {
  sesionForm!: FormGroup;
  idUsuario!: number;
  grupos: grupoDTODashboardResponse[] = [];
  alumnos: alumnoGrupoDTOResponse[] = [];
  idsSeleccionados: number[] = [];
  esIndividual = false;
  public alcanceEnum = Alcance;
  
  minFecha = new Date().toISOString().slice(0,16);

  constructor (private sesioneService: SesionesService, private grupoService: GrupoService, private inscripcionService:InscripcionService, private fb: FormBuilder, private toastr: ToastrService, private modalService: NgbModal){}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .?=-]*)*\/?$/;

   this.sesionForm = this.fb.group({
         fecha : ['', Validators.required],
         tema : ['', Validators.required],
         urlSesion: ['', [Validators.required, Validators.pattern(urlPattern)]],
         alcance: ['', Validators.required],
         plataforma:['', Validators.required],
         idGrupo:['', Validators.required],
         idsInscripcion:[[]]
       })

    this.sesionForm.get('idGrupo')?.valueChanges.subscribe(idGrupo => {
      if (idGrupo) {
      this.cargarAlumnosPorGrupo(idGrupo);
      }
    });

    this.cargarGrupos();
    
  }

  cargarAlumnosPorGrupo(idGrupo: number) {
    this.alumnos = [];
    this.inscripcionService.obtenerAlumnosPorGrupo(idGrupo).subscribe({
      next: (data) => this.alumnos = data,
      error: () => this.alumnos = []
    });
  }

  cargarGrupos(){
    this.grupoService.ActivosPorDocente(this.idUsuario)
      .subscribe(data => this.grupos = data);
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

  guardar() {
    const formValue = this.sesionForm.getRawValue();
    const fechaFormateada = this.formatearFecha(formValue.fecha);

    if (new Date(formValue.fecha) <= new Date()) {
        this.toastr.warning('La fecha y hora deben ser posterior a la actual');
        return;
    }

    const payload: sesionDTORequest = {
              ...formValue,
              fecha: fechaFormateada,
              urlSesion: this.normalizarUrl(formValue.urlSesion),
              idsInscripcion: this.esIndividual ? this.idsSeleccionados : []
            };
    this.sesioneService.crearSesion(formValue.idGrupo, payload).subscribe({
      next: () => {
        this.toastr.success('Sesión creada exitosamente', 'Creada');
        this.resetForm();
      },
      error: (err: any) => this.toastr.error(err.error?.message || 'Error en el servidor')
    });
  }

  resetForm() {
    // 1. Resetear el formulario con valores iniciales
    this.sesionForm.reset({ 
      alcance: 'GRUPAL',
      idGrupo: '' // Asegura que el select vuelva al estado inicial
    });

    // 2. Limpiar estados manuales
    this.idsSeleccionados = [];
    this.esIndividual = false;
    
    // 3. Limpiar la lista de alumnos si quieres que no se vean hasta elegir grupo
    this.alumnos = [];
  }
}
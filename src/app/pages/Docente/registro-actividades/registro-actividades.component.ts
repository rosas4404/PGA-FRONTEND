import { Component, OnInit } from '@angular/core';
import { NgbDatepickerDayView } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-day-view";
import { actividadBaseDTOResponse } from '../../../models/dto/ResponseDto/actividadBaseDTOResponse';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActividadBaseService } from '../../../services/actividad-base.service';
import { grupoDTODashboardResponse } from '../../../models/dto/ResponseDto/grupoDTODashboardResponse';
import { GrupoService } from '../../../services/grupo.service';
import { ActividadGrupoService } from '../../../services/actividad-grupo.service';
import { grupoResumenDTOResponse } from '../../../models/dto/ResponseDto/grupoResumenDTOResponse';
import { InscripcionService } from '../../../services/inscripcion.service';
import { alumnoGrupoDTOResponse } from '../../../models/dto/ResponseDto/alumnoGrupoDTOResponse';
import { asignarActividadExtraDto } from '../../../models/dto/RequestDto/asignarActividadExtraDto';
import { AsignarActividadCatalogoDto } from '../../../models/dto/RequestDto/asignarActividadCatalogoDto';
import { AsignarActividadCatalogoMultipleDto } from '../../../models/dto/RequestDto/asignarActividadCatalogoMultipleDto';
import { asignarActividadExtraMultipleDto } from '../../../models/dto/RequestDto/asignarActividadExtraMultipleDto';
import { actividadGrupoDTOResponse } from '../../../models/dto/ResponseDto/actividadGrupoDTOResponse';
import { actividadGrupoAgrupadaDTOResponse } from '../../../models/dto/ResponseDto/actividadGrupoAgrupadaDTOResponse';

@Component({
  selector: 'app-registro-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-actividades.component.html',
  styleUrl: './registro-actividades.component.scss'
})
export class RegistroActividadesComponent implements OnInit {
  modoAccion: 'crear' | 'actualizar' = 'crear';
  modo: 'catalogo' | 'extra' = 'catalogo';
  registroExtraForm! : FormGroup;
  configForm! : FormGroup;
  alcanceForm!: FormGroup;
 
  gruposFiltrados: grupoResumenDTOResponse[] = [];
  grupos: grupoResumenDTOResponse[] = [];
  mapaAlumnos = new Map<number, alumnoGrupoDTOResponse[]>();
  paso=1;
  
  actividadBaseSeleccionada : actividadBaseDTOResponse | null = null;
  actividadGrupoSeleccionada : actividadGrupoAgrupadaDTOResponse | null = null;
  
  dropdownAbierto : boolean = false;
  disponiblesCatalogo : actividadBaseDTOResponse[] = [];
  actividadesTotales : actividadGrupoAgrupadaDTOResponse[] = [];

  archivoSeleccionado : File | null = null;
  

  idUsuario! : number;

  alcance : 'grupal' | 'individual' = 'grupal';
  idGrupos : number [] =[];
  idActividades : number [] =[];
  
  grupoSeleccionado : grupoResumenDTOResponse | null = null;
  alumnos : alumnoGrupoDTOResponse [] = [];
  idInscripciones : number[] = [];


  constructor(
    private fb : FormBuilder,
    private toastr : ToastrService,
    private actividadesBaseService: ActividadBaseService,
    private grupoService: GrupoService,
    private actividadGrupoService : ActividadGrupoService,
    private inscripcionService : InscripcionService
    ){

  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;

    this.registroExtraForm = this.fb.group({
      titulo : ["", Validators.required],
      descripcion : ["", Validators.required]
    });

    this.configForm = this.fb.group({
      setInstrucciones: [false],
      setEntrega: [false],
    });
    this.alcanceForm = this.fb.group({
      esIndividual : [false]
    });
    this.cargarActividadesCatalogodisponibles();
    this.cargarActividadesGrupos();
  }
  cargarGruposDocente(){
    this.grupoService.ActivosPorDocente(this.idUsuario).subscribe(
      grupos => { 
        this.grupos = grupos;

    // precarga silenciosa
    grupos.forEach(g => {
      this.preCargarAlumnos(g);
    });
  });
  }
  preCargarAlumnos(grupo: grupoDTODashboardResponse) {
    const id = grupo.idGrupo;
  
    if (this.mapaAlumnos.has(id)) return;

    this.inscripcionService.obtenerAlumnosPorGrupo(id).subscribe(data => {
      this.mapaAlumnos.set(id, data);
    });
  }
  cargarGrupos(titulo : string){
    this.actividadGrupoService.obtenerGruposSinActividad(titulo, this.idUsuario)
      .subscribe(data => {
        this.gruposFiltrados = data
        console.log(data)});
  }
  cargarParticipantes(g: grupoResumenDTOResponse | null) {
    if (!g) {
      this.alumnos = [];
      return;
    }

    const id = g.idGrupo;
    const cache = this.mapaAlumnos.get(id);

    if (cache !== undefined) {
      this.alumnos = cache;
      return;
    }

    this.inscripcionService.obtenerAlumnosPorGrupo(id).subscribe(
      data => {
        this.alumnos = data;
        this.mapaAlumnos.set(id, data);
      });
  }
  cambiarModo(nuevoModo: 'catalogo' | 'extra') {
    this.actividadBaseSeleccionada = null;
    this.archivoSeleccionado = null;
    this.registroExtraForm.reset();

    this.modo = nuevoModo;
    if(this. modo === 'catalogo'){
      this.configForm.get('setInstrucciones')?.setValue(false);
       this.configForm.get('setInstrucciones')?.enable();
    }

    if(this.modo === 'extra'){
      this.configForm.get('setInstrucciones')?.setValue(true);
       this.configForm.get('setInstrucciones')?.disable();
    }
  }
    cambiarModoAccion(nuevoModo: 'crear' | 'actualizar') {
    this.actividadBaseSeleccionada = null;
    this.archivoSeleccionado = null;
    this.alcanceForm.get('esIndividual')?.setValue(false);
    this.configForm.get('setEntrega')?.setValue(false);
    this.configForm.get('setInstrucciones')?.setValue(false);
    this.paso = 1;
    this.registroExtraForm.reset();

    this.modoAccion = nuevoModo;  
    }
  

  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }
  seleccionarActividad(actividad: actividadBaseDTOResponse) {
    this.actividadBaseSeleccionada = actividad;
    this.dropdownAbierto = false;
    console.log (this.idUsuario, actividad.titulo)
    this.cargarGrupos( actividad.titulo);
  }
   seleccionarActividadActualizar(actividad: actividadGrupoAgrupadaDTOResponse) {
    this.actividadGrupoSeleccionada = actividad;
    this.dropdownAbierto = false;
    console.log (this.idUsuario, actividad.titulo)
    this.cargarGrupos( actividad.titulo);
    
    
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

  cargarActividadesCatalogodisponibles(){
  
  this.actividadesBaseService.getActividadesBaseActivas().subscribe({
    next : (Data) =>{
      this.disponiblesCatalogo = Data;
      console.log(this.disponiblesCatalogo);
    
    }
  });
  }
  cambiarAlcance(alcance : 'grupal' | 'individual'){
    
    this.alcance = alcance;
    if(this. alcance === 'grupal'){
      if (this.modo === 'catalogo' ){

      }
    }

    if(this.alcance === 'individual'){
  
    }

  }

  seleccionGrupo( id: number, event : any){
    if (event.target.checked) {
      if (!this.idGrupos.includes(id)) {
      this.idGrupos.push(id);
      }
    } else {
      this.idGrupos = this.idGrupos
      .filter(g => g !== id);
    }
}
onGrupoChange(event: any) {
  const id = event.target.value;
  this.grupoSeleccionado = this.gruposFiltrados.find(g => g.idGrupo == id)|| null;
}


seleccionAlumno(id: number, event: any) {
  if (event.target.checked) {
    if (!this.idInscripciones.includes(id)) {
      this.idInscripciones.push(id);
    }
  } else {
    this.idInscripciones = this.idInscripciones.filter(i => i !== id);
  }
}

regresar(){
 if( this.paso == 3){
  this.idInscripciones = [];
  this.idGrupos = []
  this.alcanceForm.get('esIndividual')?.setValue(false);
  
  this.paso = 2;
 }
 else{
  this.archivoSeleccionado = null;
  this.configForm.get('setInstrucciones')?.setValue(this.modo == 'catalogo' ?  false : true);
  this.configForm.get('setEntrega')?.setValue(false);
  this.paso =1
 } 
}

cancelar(){
  this.actividadBaseSeleccionada = null;
  this.modo = 'catalogo';
}

  guardar(){
    const esIndividual = this.alcanceForm.get('esIndividual')?.value === true;
   
    switch (`${this.modo}-${esIndividual}`) {
        case  'catalogo-true':

          if (!this.grupoSeleccionado?.idGrupo) return;
          if(!this.actividadBaseSeleccionada?.idActividad) return;
          const idGrupo = this.grupoSeleccionado.idGrupo;
          const dtoCatalogo : AsignarActividadCatalogoDto = {
              idActividadBase : this.actividadBaseSeleccionada.idActividad,
              reqEntrega : this.configForm.get('setEntrega')?.value,
              alcance : 'INDIVIDUAL',
              idInscripciones: this.idInscripciones
          };
          this.actividadGrupoService.agregarDesdeCatalogo(idGrupo, dtoCatalogo,this.archivoSeleccionado).subscribe({
            next : (data) => {
              this.toastr.success('Actividad registrada con éxito', 'Exito');
              this.resetear();
            },
            error : (err) => {
            this.toastr.error(err.error?.message || 'Error al hacer el registro', 'Error')
          }
        });
          break;
      
        case  'catalogo-false':
          if(!this.actividadBaseSeleccionada?.idActividad) return;
          const dtoCatalogoMultiple : AsignarActividadCatalogoMultipleDto ={
            idActividadBase : this.actividadBaseSeleccionada.idActividad,
            reqEntrega : this.configForm.get('setEntrega')?.value,
            alcance: 'GRUPAL',
            idGrupos: this.idGrupos
          };
          
          this.actividadGrupoService.agregarDesdeCatalogoMultipleGrupos(dtoCatalogoMultiple, this.archivoSeleccionado).subscribe({
            next : () => {
              this.toastr.success('Actividad registrada con éxito', 'Exito');
              this.resetear();
            },
            error : (err) => {
            this.toastr.error(err.error?.message || 'Error al hacer el registro', 'Error')
            }
          });

          break;
        case 'extra-true':
          
          
          const extraBase: asignarActividadExtraDto = {
            titulo : this.registroExtraForm.get('titulo')?.value,
            descripcion : this.registroExtraForm.get('descripcion')?.value,
            reqEntrega : this.configForm.get('setEntrega')?.value,
            alcance : 'INDIVIDUAL',
            idInscripciones: this.idInscripciones
          };
          if (!this.grupoSeleccionado?.idGrupo) return;
          this.actividadGrupoService.agregarextra(this.grupoSeleccionado.idGrupo,extraBase, this.archivoSeleccionado).subscribe({
            next : () => {
              this.toastr.success('Actividad registrada con éxito', 'Exito');
              this.resetear();
            },
            error : (err) => {
            this.toastr.error(err.error?.message || 'Error al hacer el registro', 'Error')
            }
          });
          break;
        case 'extra-false':
          const extraBaseMultiple: asignarActividadExtraMultipleDto = {
            titulo : this.registroExtraForm.get('titulo')?.value,
            descripcion : this.registroExtraForm.get('descripcion')?.value,
            reqEntrega : this.configForm.get('setEntrega')?.value,
            alcance : 'GRUPAL',
            idGrupos : this.idGrupos
          };
          this.actividadGrupoService.agregarExtraMultipleGrupos( extraBaseMultiple, this.archivoSeleccionado).subscribe({
            next : () => {
              this.toastr.success('Actividad registrada con éxito', 'Exito');
              this.resetear();
            },
            error : (err) => {
            this.toastr.error(err.error?.message || 'Error al hacer el registro', 'Error')
            }
          });

          break;
        default:
          break;
      }
      this.cargarActividadesGrupos();
    }

    resetear(){
      this.registroExtraForm.reset();
      this.configForm.reset();
      this.alcanceForm.reset();
      this.paso=1;
      this.actividadBaseSeleccionada = null;
      this.actividadGrupoSeleccionada = null;
    }

    cargarActividadesGrupos(){
      
      this.actividadGrupoService.cargarActividadesGruposDocente(this.idUsuario).subscribe({
       next: (data) => {
        this.actividadesTotales = data;
       }
      });
    }

  seleccionGrupoActualizar( id: number, event : any){
    if (event.target.checked) {
      if (!this.idActividades.includes(id)) {
        this.idActividades.push(id);
      }
    } else {
      this.idActividades = this.idActividades
      .filter(a => a !== id);
    }
  }
    
    actualizar(){
      this.actividadGrupoService.actualizarInstruccionesMultiple(this.idActividades,this.archivoSeleccionado).subscribe({
        next : () => {
              this.toastr.success('Actividad actualizada con éxito', 'Exito');
              this.resetear();
            },
            error : (err) => {
            this.toastr.error(err.error?.message || 'Error al hacer la actualización', 'Error')
            }
      })
    }
    abrirInstrucciones() {
  if(this.actividadBaseSeleccionada)
  this.actividadesBaseService.verInstrucciones(this.actividadBaseSeleccionada.idActividad).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    error: (err) => {
      console.error(err);
    }
  });
}
  }


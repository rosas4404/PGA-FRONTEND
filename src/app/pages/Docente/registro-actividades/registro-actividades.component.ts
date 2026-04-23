import { Component, OnInit } from '@angular/core';
import { NgbDatepickerDayView } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-day-view";
import { actividadBaseDTOResponse } from '../../../models/dto/ResponseDto/actividadBaseDTOResponse';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActividadBaseService } from '../../../services/actividad-base.service';
import { grupoDTODashboardResponse } from '../../../models/dto/ResponseDto/grupoDTODashboardResponse';
import { GrupoService } from '../../../services/grupo.service';

@Component({
  selector: 'app-registro-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-actividades.component.html',
  styleUrl: './registro-actividades.component.scss'
})
export class RegistroActividadesComponent implements OnInit {

  modo: 'catalogo' | 'extra' = 'catalogo';
  esIndividual =  false;
  setInstrucciones = false;

  actividadBaseSeleccionada : actividadBaseDTOResponse | null = null;
  registroExtraForm! : FormGroup;
  
  dropdownAbierto : boolean = false;
  disponibles : actividadBaseDTOResponse[] = [];

  archivoSeleccionado : File | null = null;
  setEntrega = false;

  grupos: grupoDTODashboardResponse[] = [];
  idUsuario! : number;

  constructor(
    private fb : FormBuilder,
    private toastr : ToastrService,
    private actividadesBaseService: ActividadBaseService,
    private grupoService: GrupoService
    ){

  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;
    this.registroExtraForm = this.fb.group({
      titulo : ["", Validators.required],
      descripcion : ["", Validators.required]
    });
    this.cargarActividadesCatalogodisponibles();
    this.cargarGrupos();
  }
  cargarGrupos(){
    this.grupoService.ActivosPorDocente(this.idUsuario)
      .subscribe(data => this.grupos = data);
  }
  cambiarModo(nuevoModo: 'catalogo' | 'extra') {
    this.actividadBaseSeleccionada = null;
    this.registroExtraForm.reset();

    this.modo = nuevoModo;
    if(this. modo === 'catalogo'){
      this.setInstrucciones = false;
    }

    if(this.modo === 'extra'){
      this.setInstrucciones = true;
    }
  }

  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }
  seleccionarActividad(actividad: any) {
    this.actividadBaseSeleccionada = actividad;
    this.dropdownAbierto = false;
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

  }
  cargarActividadesCatalogodisponibles(){
  
  this.actividadesBaseService.getActividadesBaseActivas().subscribe({
    next : (Data) =>{
      this.disponibles = Data
    
    }
  });
}
}

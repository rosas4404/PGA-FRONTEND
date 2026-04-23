import { Component, OnInit } from '@angular/core';
import { ActividadBaseService } from '../../../services/actividad-base.service'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { campoDTOResponse } from '../../../models/dto/ResponseDto/campoDTOResponse'; 
import { actividadBaseDTOResponse } from '../../../models/dto/ResponseDto/actividadBaseDTOResponse'; 
import { CommonModule } from '@angular/common';
import { CampoFormativoService } from '../../../services/campo-formativo.service';
import { actividadBaseDTORequest } from '../../../models/dto/RequestDto/actividadBaseDTORequest';

@Component({
  selector: 'app-actividad-base',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  ],
  templateUrl: './actividad-base.component.html',
  styleUrl: './actividad-base.component.scss'
})
export class ActividadBaseComponent implements OnInit{
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;

  filtroForm! : FormGroup;
  campos :  campoDTOResponse [] = [];
  actividades : actividadBaseDTOResponse[] = [];

  actividadSeleccionada : actividadBaseDTOResponse = {
    idActividad:0,
    titulo:'',
    descripcion:'',
    activo : true,
    campoFormativo: {
      idCampo:0,
      nombre:'',
      descripcion: '',
      activo : true
    },
    urlInstrucciones : ""

  };

  tituloAccion : string = '';
  accionTexto : string = '';
  tituloActividad : string = '';

  crearForm! : FormGroup;
  modalRef : any;


  modoEdicion = false;

  archivoSeleccionado: File | null = null

  constructor(private fb: FormBuilder,
      private toastr: ToastrService, 
      private route: ActivatedRoute,
      private modalService : NgbModal,
      private actividadBaseService : ActividadBaseService,
      private campoFormativoService : CampoFormativoService ){}
      
  ngOnInit(): void {
  
    this.filtroForm = this.fb.group({
      nombre : ['', Validators.required],
      activo : ['', Validators.required],
      idCampo : ['',Validators.required]
      
    });

    this.crearForm = this.fb.group({
      titulo : ['', Validators.required],
      descripcion : ['', Validators.required],
      idCampoFormativo : ['', Validators.required],
      archivo : [null]
    })

    this.cargarActividadesBase();
    this.cargarCamposFormativos();
}


  cargarCamposFormativos(){
    this.campoFormativoService.obtenerCamposActivos().subscribe(
      data => {
        this.campos = data;
      }
    )
  }
  cargarActividadesBase() {
    const filtros = {
    nombre : this.filtroForm.value.nombre || null,
    activo : this.filtroForm.value.activo  || null,
    idCampo : this.filtroForm.value.idCampo || null
    };
      this.actividadBaseService.obtenerActividadesBase(this.page, this.size, filtros).subscribe(
        data => {
          this.actividades = data.content;
          this.totalPages = data.totalPages;
          this.totalElements = data.totalElements;
          console.log(this.totalElements);
      });
      
  }
  buscar(){
    this.page = 0;
    this.cargarActividadesBase();

  }
  limpiarFiltros(){
    this.filtroForm.reset({
      nombre : '',
      activo : '',
      idCampo : ''
    });
    this.page=0;
    this.cargarActividadesBase();
    this.cargarCamposFormativos();
  }
  get paginas(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i);
  }
  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
    this.page = nuevaPagina;
    this.cargarActividadesBase();
  }

  abrirDetalleActividad(a:actividadBaseDTOResponse, content:any){
    (document.activeElement as HTMLElement)?.blur();
    this.actividadSeleccionada = a;

    this.modalRef = this.modalService.open(content, {
    centered: true,
    backdrop: 'static',
    keyboard: false
    });
    this.modalRef.result.finally(() => {
      this.cerrarModal();
    });
  }
  abrirConfirmacion(a: actividadBaseDTOResponse , content: any){
    (document.activeElement as HTMLElement)?.blur();
     this.actividadSeleccionada = a;
    if (a.activo) {
      this.tituloAccion = "desactivar la actividad base";
      this.accionTexto = `Este cambio se reflejará únicamente en los nuevos grupos.
        `;
    } else {
        this.tituloAccion = "activar la actividad base";
        this.accionTexto = "";
}

    this.tituloActividad = a.titulo;
    this.modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
      });
      this.modalRef.result.finally(() => {
        this.cerrarModal();
      });
  }
  activarDesactivar(modal : any){
    this.actividadBaseService.desactivarActivar(this.actividadSeleccionada.idActividad)
    .subscribe({
      next: () => {
        this.toastr.success ('Estado actualizado correctamente');
        this.cargarActividadesBase();
        modal.close();

      },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al cambiar estado');
        }
      });
  }
  submit() {

    if (!this.modoEdicion && !this.archivoSeleccionado) {
      this.toastr.error('Debes subir un archivo');
      return;
    }
    if (this.crearForm.invalid) {
      this.crearForm.markAllAsTouched();
      return;
    }
   
    const dto: actividadBaseDTORequest = {
      titulo: this.modoEdicion ? this.crearForm.getRawValue().titulo : this.crearForm.value.titulo,
      descripcion: this.modoEdicion ? this.crearForm.getRawValue().descripcion : this.crearForm.value.descripcion,
      idCampoFormativo: this.modoEdicion ? this.crearForm.getRawValue().idCampoFormativo :this.crearForm.value.idCampoFormativo
    };

    if (!this.modoEdicion) {

      this.actividadBaseService.registro(dto, this.archivoSeleccionado).subscribe({
        next: () => {
          this.toastr.success('Actividad registrada correctamente', 'Éxito');
          this.cerrarModal();
          this.cargarActividadesBase();
        },
        error: (err) => {
          this.toastr.error('Ocurrió un error al registrar ' + err.message, 'Error');
        }
      });
    } else {

      this.actividadBaseService
        .actualizar(dto, this.archivoSeleccionado, this.actividadSeleccionada.idActividad)
        .subscribe({
          next: () => {
            this.toastr.success('Actividad actualizada correctamente');
            this.cargarActividadesBase();
            this.cerrarModal();
          },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Error al actualizar actividad');
        }
      });

  }
}
  abrirModal(content : any){
    (document.activeElement as HTMLElement)?.blur();
    this.resetear();
    this.cargarCamposFormativos();

    this.crearForm.get('archivo')?.setValidators(Validators.required);
      
    this.modalRef = this.modalService.open( content, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    this.modalRef.result.finally(() => {
    this.resetear();
    });
  }
  cerrarModal(){
    this.resetear();
    this.modalRef?.dismiss();
  }
  resetear(){
    this.crearForm.reset();

    this.crearForm.get('titulo')?.enable();
    this.crearForm.get('idCampoFormativo')?.enable();

    this.archivoSeleccionado = null;
    this.modoEdicion = false;
  }


  abrirEditar(a:actividadBaseDTOResponse, content:any){
    (document.activeElement as HTMLElement)?.blur();
    this.resetear();
    this.modoEdicion = true;
    this.actividadSeleccionada = a;

    this.crearForm.get('archivo')?.clearValidators();
    this.crearForm.get('archivo')?.updateValueAndValidity();

    this.crearForm.patchValue({
      titulo: a.titulo,
      descripcion: a.descripcion,
      idCampoFormativo: a.campoFormativo.idCampo
    });

    this.crearForm.get('titulo')?.disable();
    this.crearForm.get('idCampoFormativo')?.disable();

    this.modalRef = this.modalService.open( content, {
        backdrop: 'static',
        keyboard: false,
        centered: true
    });
    this.modalRef.result.finally(() => {
    this.resetear();
    });
}

onFileSelected(event : any){
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
      this.crearForm.patchValue({
      archivo: archivo
    });
      this.crearForm.get('archivo')?.markAsTouched();
    } else {
      // Si canceló la selección sin elegir nada
      this.toastr.warning('No se seleccionó ningún archivo');
    }
    
     event.target.value = '';
}
}




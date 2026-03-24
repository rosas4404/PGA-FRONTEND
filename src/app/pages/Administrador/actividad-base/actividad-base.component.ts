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
    }

  };

  tituloAccion : string = '';
  accionTexto : string = '';
  tituloActividad : string = '';

  crearForm! : FormGroup;
  modalRef : any;


  modoEdicion = false;

  constructor(private fb: FormBuilder,
      private toastr: ToastrService, 
      private route: ActivatedRoute,
      private modalService : NgbModal,
      private actividadBaseService : ActividadBaseService,
      private campoFormativoService : CampoFormativoService ){}
      
  ngOnInit(): void {
  
    this.filtroForm = this.fb.group({
      nombre : [''],
      activo : [''],
      idCampo : ['']
    });

    this.crearForm = this.fb.group({
      titulo : ['', Validators.required],
      descripcion : ['', Validators.required],
      idCampoFormativo : ['', Validators.required]
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
    this.actividadSeleccionada = a;

    this.modalService.open(content, {
    centered: true,
    backdrop: 'static',
    keyboard: false
  });


}

  abrirConfirmacion(a: actividadBaseDTOResponse , content: any){
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
    const modalRef = this.modalService.open(content, {
    centered: true,
    backdrop: 'static',
    keyboard: false
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

  submit(){
    if (this.crearForm.invalid) {
      this.crearForm.markAllAsTouched();
      return;
    }
    const formValue = { ...this.crearForm.value }
  

    // Mayúsculas
    formValue.titulo = formValue.titulo?.toUpperCase();
    formValue.descripcion = formValue.descripcion?.toUpperCase();
    formValue.idCampoFormativo = formValue.idCampoFormativo;

    if(!this.modoEdicion){
    this.actividadBaseService.registro(formValue).subscribe({
        next: (data:any)=>{
          this.toastr.success('Actividad registrada correctamente', 'Éxito')
          this.cerrarModal();
          this.cargarActividadesBase();
        },
        error: (err)=>{
          this. toastr.error('Ocurrió un error al registrar' + err.massage, 'Error')
        }
      });
  }else{
    this.actividadBaseService.actualizar(formValue, this.actividadSeleccionada.idActividad).subscribe({
        next: () => {
        this.toastr.success ('Actividad actualizada correctamente');
        this.cargarActividadesBase();
        this.cerrarModal();

      },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al actualizar actividad');
        }
      });
      
  }
}
  abrirModal(content : any){
      this.resetear();
      this.cargarCamposFormativos();
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
    this.modalRef.dismiss();
    this.modoEdicion = false;
    this.resetear();
  }
  resetear(){
    this.crearForm.reset();
  }


  abrirEditar(a:actividadBaseDTOResponse, content:any){

  this.modoEdicion = true;
  this.actividadSeleccionada = a;

  this.crearForm.patchValue({
    titulo: a.titulo,
    descripcion: a.descripcion,
    idCampoFormativo: a.campoFormativo.idCampo
  });
  
  this.modalRef = this.modalService.open( content, {
        backdrop: 'static',
        keyboard: false,
        centered: true
    });
    this.modalRef.result.finally(() => {
    this.resetear();
    });
}
}




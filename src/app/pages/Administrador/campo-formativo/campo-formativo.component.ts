import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { campoDTOResponse } from '../../../models/dto/ResponseDto/campoDTOResponse';
import { campoDTORequest } from '../../../models/dto/RequestDto/campoDTORequest';
import { CampoFormativoService } from '../../../services/campo-formativo.service';


@Component({
  selector: 'app-campo-formativo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './campo-formativo.component.html',
  styleUrl: './campo-formativo.component.scss'
})
export class CampoFormativoComponent implements OnInit{
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0


  filtroForm! : FormGroup;
  crearForm! : FormGroup;  
  campos :  campoDTOResponse [] = []

  accionTexto: string ='';
  tituloAccion : string = '';
  nombreCampo : string = '';
  modalRef : any;

  campo : campoDTORequest = {
    nombre : '',
    descripcion: ''
  }
  campoSeleccionado : number = 0;


  modoEdicion = false;


  constructor( 
    private fb: FormBuilder,
    private toastr: ToastrService, 
    private route: ActivatedRoute,
    private modalService : NgbModal,
    private campoService : CampoFormativoService
  ){}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      nombre : [''],
      activo : ['']
    });

    this.crearForm = this.fb.group({
      nombre : ['',Validators.required],
      descripcion : ['',Validators.required]
    })

    this.cargarCampos();    
  }

  cargarCampos() {
    const filtros = {
      nombre: this.filtroForm.value.nombre|| null,
      activo: this.filtroForm.value.activo  || null,
      };
      this.campoService.obtenerCampos (this.page, this.size, filtros).subscribe(
        data => {
          this.campos = data.content;
          this.totalPages = data.totalPages;
          this.totalElements = data.totalElements;


      });
  }

  buscar(){
    this.page = 0;
    this.cargarCampos();
  }

  limpiarFiltros(){
    this.filtroForm.reset({
      nombre : '',
      activo: ''
    });
    this.page = 0;
    this.cargarCampos();
  }

  cambiarPagina(nuevaPagina: number) {
      if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
      this.page = nuevaPagina;
       this.cargarCampos();
      }
    
  get paginas(): number[] {
      return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  abrirModal(content : any){
    this.modoEdicion = false;
    this.resetear();
    this.modalRef = this.modalService.open( content, {
        backdrop: 'static',
        keyboard: false,
        centered: true
    });
    this.modalRef.result.finally(() => {
    this.resetear();
    });

  }
  resetear() {
    this.crearForm.reset();
  }

  cerrarModal(){
    this.resetear();
    this.modoEdicion = false;
    this.modalRef.dismiss();


  }
  AbrirConfirmacion(c:campoDTOResponse, content : any){
    this.campoSeleccionado = c.idCampo; 
    if (c.activo) {
      this.tituloAccion = "Desactivar campo formativo";
      this.accionTexto = `
        • Todas las actividades relacionadas también se desactivarán.
        • Este cambio se reflejará únicamente en los nuevos grupos.
        `;
    } else {
        this.tituloAccion = "Activar campo formativo";
        this.accionTexto = "";
}

    this.nombreCampo = c.nombre;
  const modalRef = this.modalService.open(content, {
    centered: true,
    backdrop: 'static',
    keyboard: false
  });

  }
  crear(){
    if (this.crearForm.invalid) {
      this.crearForm.markAllAsTouched();
      return;
    }
      
    this.campo = {
      nombre : this.crearForm.value.nombre.toUpperCase(),
       descripcion : this.crearForm.value.descripcion.toUpperCase()
    };
    if (!this.modoEdicion){
  
        this.campoService.crearCampo (this.campo).subscribe ({
          next: (data) =>{
          this.toastr.success('Campo registrado correctamente', 'Éxito');
          this.cerrarModal();
          this.cargarCampos();
          },
          error: (err)=>{
            this.toastr.error(err.error.message || 'Ocurrió un error al registrar', 'Error')
          }
      });
    }else{
      console.log(this.campo);
      console.log(this.campoSeleccionado);
      this.campoService.actualizar(this.campo, this.campoSeleccionado).subscribe({
        next: () => {
        this.toastr.success ('Campo actualizado correctamente');
        this.cargarCampos();
        this.cerrarModal();

      },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al actualizar campo');
        }
      });
      
    }

  }
  activarDesactivar(modal : any){
    this.campoService.desactivarActivar(this.campoSeleccionado)
    .subscribe({
      next: () => {
        this.toastr.success ('Estado actualizado correctamente');
        this.cargarCampos();
        modal.close();

      },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al cambiar estado');
        }
      });
  }

  abrirEditar(campo:any, content:any){

  this.modoEdicion = true;
  this.campoSeleccionado = campo.idCampo

  this.crearForm.patchValue({
    nombre: campo.nombre,
    descripcion: campo.descripcion,
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

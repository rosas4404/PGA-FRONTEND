import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { documentoDTOResponse } from '../../../models/dto/ResponseDto/documentoDTOResponse'; 
import { DocumentoService } from '../../../services/documento.service'; 
import { ToastrService } from 'ngx-toastr';
import { documentoDTORequest } from '../../../models/dto/RequestDto/documentoDTORequest'; 
import { Tipo } from '../../../models/enum/tipo';

@Component({
  selector: 'app-documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './documento.component.html',
  styleUrl: './documento.component.scss'
})
export class DocumentoComponent implements OnInit{

  documentos: documentoDTOResponse[] = [];

  documentoSeleccionado!: documentoDTOResponse; //para ver los datos
  accionTexto!: string;

  //paginacion
  totalPages=0;
  page = 0;
  size = 5;

  //FILTRO DINAMICO
  filtroFormulario!: FormGroup;
  totalElements = 0;

  documentoForm!: FormGroup;

  modo: 'crear' | 'editarDocumento' = 'crear';

  constructor(private documentoService:DocumentoService, private fb: FormBuilder, private toastr: ToastrService, private modalService: NgbModal){}

  ngOnInit(): void {
    this.documentoForm=this.fb.group({
      tipo: [{value:'', disabled:false},Validators.required],
      nombre: ['', Validators.required],
      obligatorio: [true, {nonNullable:true}]
    })

    this.filtroFormulario = this.fb.group({
      nombre: [""],
      activo: [""]
    });

    this.documentoPaginacion();
  }

  abrirModal(content: any) {
    this.modalService.open(content, {
      //size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  nuevoDocumento(){
    this.modo ='crear';
    this.documentoForm.reset();
    //habilitar campos
    this.documentoForm.enable();
  }

  guardar(modal:any){
    if(this.documentoForm.invalid)return;

    const formValue: documentoDTORequest=this.documentoForm.getRawValue();//incluye campos deshabilitados
          console.log(formValue);
        if(this.modo=='editarDocumento'){
          this.documentoService.actualizarDocumento(this.documentoSeleccionado.idDocumento, formValue)
            .subscribe({
              next: () => {
                this.toastr.success('Actualizado correctamente');
                this.documentoPaginacion();
                modal.close();
                this.cancelar();
                //this.modo = 'crear'; // SOLO cambia modo
              },
              error: (err)=>{
                this.toastr.error(err.error.message || 'Error');
              }
          });
        }else{
          this.documentoService.crearDocumento(formValue).subscribe({
            next: () => {
              this.toastr.success('Creado', 'Documento creado correctamente');
              this.documentoPaginacion();
              modal.close();
              this.cancelar();
            },
            error: (err)=>{
              this.toastr.error(err.error.message || 'err', 'Error al crear');
            }
        });
    }
  }


  editar(documento: documentoDTOResponse, content: any){
    this.documentoSeleccionado = documento;

    this.documentoForm.patchValue({
      nombre: this.documentoSeleccionado.nombre,
      tipo : documento.tipo
    })
    //bloquear campos
    this.documentoForm.disable();
    this.abrirModal(content);
  }

  activarEdicionDocumento(){
    this.modo='editarDocumento';
    this.documentoForm.enable();
    this.documentoForm.get('tipo')?.disable();
    //pendiente
  }

  
  abrirconfirmacion(documento: documentoDTOResponse, content: any) {
    this.documentoSeleccionado = documento;
    if(documento.activo===true){
      this.accionTexto='desactivar el ' + documento.tipo
    }else{
      this.accionTexto='activar el ' + documento.tipo
    }
    this.modalService.open(content, {
      centered: true
    });
    //quita el warning de abrir
    (document.activeElement as HTMLElement)?.blur();
  }

  confirmarDesactivacion(modal: any) {
    this.documentoService.habilitarDeshabilitar(this.documentoSeleccionado.idDocumento)
      .subscribe({
        next: () => {
          this.toastr.success('Estado actualizado correctamente');
          this.documentoPaginacion();
          modal.close();
        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al cambiar estado');
        }
      });
  }

  cancelar() {
    this.modo = 'crear';
    this.documentoForm.reset();
    this.documentoForm.enable();
  }
  
  documentoPaginacion(){
    const filtros = this.filtroFormulario?.value || {};

    this.documentoService.consultaGeneralPage(
      this.page,
      this.size,
      filtros
    ).subscribe(resp => {
      this.documentos = resp.content;
      this.totalElements = resp.totalElements;
      this.totalPages = resp.totalPages;
    });
  }
  
  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
  
  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
    this.page = nuevaPagina;
    this.buscar();
  }

  //filtros
  buscar() {
    this.documentoPaginacion();
  }

  limpiarFiltros() {
    this.filtroFormulario.reset({
      nombre:[""],
      activo:[""]
    });
    this.page = 0;
    this.documentoPaginacion();
  }

  editarModoDirecto(id: number, modal:any){
    this.documentoService.documentoID(id).subscribe(documento => {

      this.documentoSeleccionado = documento;

      this.documentoForm.patchValue({
        tipo : documento.tipo, 
        nombre : documento.nombre,
      });
      this.modo = 'editarDocumento';
      this.documentoForm.enable();
      this.documentoForm.get('tipo')?.disable();
      this.abrirModal(modal);
    });
  }
}

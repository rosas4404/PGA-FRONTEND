import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLinkActive, TitleStrategy } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { usuarioDTOResponse } from '../../../models/dto/ResponseDto/usuarioDTOResponse';
import { UserService } from '../../../services/user.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ReporteService } from '../../../services/reporte.service';
import baseUrl from '../../../services/helper';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  //tipo de usuario
  tipo : string ='';
    
  filtroForm!: FormGroup;
  registroForm!: FormGroup;

  //paginación
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;

  detalleSeleccionado : usuarioDTOResponse | null = null ;
  usuarioSeleccionado : number = 0;
  accionTexto : string = '';

  usuarios : usuarioDTOResponse [] = [];
  modalRef: any;


   
  constructor(private fb: FormBuilder, 
    private userService:UserService, 
    private toastr: ToastrService, 
    private route: ActivatedRoute,
    private modalService : NgbModal,
    private usuarioService : UsuarioService,
    private reporteService : ReporteService
  ){}

    ngOnInit(): void {
      //filtro form
      this.filtroForm = this.fb.group({
        nombre : [''],
        estado : ['']
      })
      //registro form
      this.registroForm = this.fb.group({
        rol:[''],
        //datos generales
          nombre: ['',Validators.required],
          apellidoPaterno: ['',Validators.required],
          apellidoMaterno: ['',Validators.required],
          direccion: ['',Validators.required],
          email: ['',[Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
          telefono: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("[0-9]*")]],
        }); 
        
      // cargar usuarios
      this.tipo = this.route.snapshot.data['usuario'];
      console.log(this.tipo);
      if (this.tipo == 'alumnos'){
        this.cargarAlumnos();
      }else{
        this.cargarDocentes();
      }
    }

    cargarAlumnos(){
      const filtros = {
      nombre: this.filtroForm.value.nombre|| null,
      estado: this.filtroForm.value.estado|| null,
      
      };
      this.usuarioService.obtenerAlumnos(this.page,this.size,filtros).subscribe(
      data => {
        this.usuarios = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
      });
    }
    cargarDocentes(){
      const filtros = {
      nombre: this.filtroForm.value.nombre|| null,
      estado: this.filtroForm.value.estado  || null,
      };
      this.usuarioService.obtenerDocentes(this.page,this.size,filtros).subscribe(
      data => {
        this.usuarios = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
      });
    }

    buscar(){
      this.page = 0
      if (this.tipo == 'alumnos'){
          this.cargarAlumnos();
      }else {  
          this.cargarDocentes();
      }

    }

    limpiarFiltros(){
      this.filtroForm.reset({
        nombre : '',
        estado : ''
    });
      this.page=0;
       if (this.tipo == 'alumnos'){
          this.cargarAlumnos();
      }else {
          this.cargarDocentes();
      }

    }
    get paginas(): number[] {
      return Array.from({ length: this.totalPages }, (_, i) => i);
    }

    cambiarPagina(nuevaPagina: number) {
      if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
      this.page = nuevaPagina;
       if (this.tipo == 'alumnos'){
          this.cargarAlumnos();
      }else {  
          this.cargarDocentes();
      }
    }
    submit() {
      if (this.registroForm.invalid) {
        this.registroForm.markAllAsTouched();
        return;
      }

      const formValue = { ...this.registroForm.value }

      // Mayúsculas
      formValue.nombre = formValue.nombre?.toUpperCase();
      formValue.apellidoPaterno = formValue.apellidoPaterno?.toUpperCase();
      formValue.apellidoMaterno = formValue.apellidoMaterno?.toUpperCase();
      formValue.direccion = formValue.direccion?.toUpperCase();
      if(this.tipo == 'alumnos'){
        formValue.rol = 'ALUMNO'
      }else {
        formValue.rol = 'DOCENTE'
      }

    this.userService.register(formValue).subscribe({
        next: (data:any)=>{
        this.toastr.success('Usuario registrado correctamente', 'Éxito')
        this.cerrarModal();
        if (this.tipo == 'alumnos'){
          this.cargarAlumnos();
        }else {
          this.cargarDocentes();
        }
        
        },
        error: (err)=>{
          this. toastr.error('Ocurrió un error al registrar' + err.massage, 'Error')
        }
      });
      
    }
    AbrirConfirmacion(usuario : usuarioDTOResponse, content : any){
  

    if(usuario.activo === true){

          this.accionTexto='desactivar el usuario con Id : ' + usuario.idUsuario
          + ' perteneciente a  ' + usuario.nombre + ' ' +usuario.apellidoPaterno
        }else{
          this.accionTexto='activar la inscripcion con Id : ' + usuario.idUsuario
          + ' perteneciente a  ' + usuario.nombre + ' ' +usuario.apellidoPaterno
        }
       this.usuarioSeleccionado = usuario.idUsuario; 
      const modalRef = this.modalService.open(content, {
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    
    }

    cerrarModal(){
      
      this.modalRef.dismiss();
      this.resetear();


    }
    resetear() {
      this.registroForm.reset();
      }

    abrirModal(content:any){
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
  
  
  
    activarDesactivar(modal:any){
      this.usuarioService.desactivarActivarUsuario(this.usuarioSeleccionado )
      .subscribe({
        next: () => {
          this.toastr.success('Estado actualizado correctamente');
          if (this.tipo == 'alumnos'){
            this.cargarAlumnos();
          }else {
            this.cargarDocentes();
          }
          modal.close();

        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al cambiar estado');
        }
      });
    }

    abrirDetalle(i: usuarioDTOResponse , content: any){
      this.detalleSeleccionado = i;
      this.modalService.open(content, {
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
    descargarReporte(id: number) { 1
      window.open(`${baseUrl}/reporte/alumnos/${id}/reporte`, '_blank');
    }
  
}


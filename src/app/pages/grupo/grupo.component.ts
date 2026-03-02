import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { grupoDTOResponse } from '../../models/dto/ResponseDto/grupoDTOResponse';
import { GrupoService } from '../../services/grupo.service';
import { ToastrService } from 'ngx-toastr';
import { grupoDTORequest } from '../../models/dto/RequestDto/grupoDTORequest';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CursoService } from '../../services/curso.service';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './grupo.component.html',
  styleUrl: './grupo.component.scss'
})
export class GrupoComponent implements OnInit{

  grupos: grupoDTOResponse [] = [];
  docentes: any[] = [];
  cursos: any[] = [];

  grupoSeleccionadoId! : number;
  accionTexto! : string;//ayuda para cambiar el mensaje en el estado
  docenteSeleccionadoNombre: string ='';
  //conteo de tarjetas
  totalGrupos=0;
  gruposActivos=0;
  gruposInactivos=0;

  //paginacion
  totalPages = 0;
  page = 0;
  size = 3;

  grupoForm!: FormGroup;
  //FILTRO DINAMICO
  filtroFormulario!: FormGroup;
  totalElements = 0;

  selectedId!: number;
  mostrarFormulario = false;
  modo: 'crear' | 'ver' | 'editarDocente' = 'crear';

  
  
  //fata añadir el servicio de docente y curso NOTA
  constructor(private grupoService: GrupoService, private cursoService: CursoService, private usuarioServicie: UsuarioService, private fb:FormBuilder, private toastr:ToastrService, private modalService:NgbModal){}

  ngOnInit(): void {
    this.filtroFormulario = this.fb.group({
      curso: [''],
      docente: [''],
      estado: ['']
    });
    
    this.grupoForm = this.fb.group({
      nombre: ['', Validators.required],
      periodo: ['', Validators.required],
      idCurso: [null, Validators.required],
      idDocente:[null, Validators.required]
    });

    this.gruposPaginacion();
    this.cargarConteos();
    this.cargarDocentes();
    this.cargarCursos();
    
  }

  cargarDocentes(){
    this.usuarioServicie.getDocentesActivos().subscribe({
      next: data => this.docentes = data
    });  
  }

  cargarCursos(){
    this.cursoService.getcursoActivos().subscribe({
      next: data => this.cursos = data
    });
  }

   abrirModal(content: any) {
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  nuevoGrupo(){
    this.modo= 'crear';
    this.grupoForm.reset();
    //habilitar campos
    this.grupoForm.enable();
  }

  guardar(modal: any){
    if(this.grupoForm.invalid)return;

    const formValue: grupoDTORequest=this.grupoForm.value;

    if(this.modo=='editarDocente'){
      this.grupoService.actualizarDocenteGrupo(this.selectedId, formValue.idDocente!, formValue).subscribe({
        next: () => {
          this.toastr.success('Actulizado', 'Docente actualizado correctamente');
          this.gruposPaginacion();
          modal.close();
          this.cancelar();
        },
        error: (err)=>{
          this.toastr.error(err.error.message || 'err', 'Error al cambiar docente');
        }
      });
    }else{
      this.grupoService.crearGrupo(formValue).subscribe({
        next: () => {
          this.toastr.success('Creado', 'Grupo creado correctamente');
          this.gruposPaginacion();
          this.cargarConteos();
          modal.close();
          this.cancelar();
        },
        error: (err)=>{
          this.toastr.error(err.error.message || 'err', 'Error al crear');
        }
      });
    }
  }

  editar(grupo: grupoDTOResponse, content:any){
    this.modo = 'ver';
    this.selectedId = grupo.idGrupo!;

     this.grupoForm.patchValue({
      nombre: grupo.nombre,
      periodo: grupo.periodo,
      idCurso: grupo.idCurso,
      idDocente: grupo.idUsuario
    });

    this.docenteSeleccionadoNombre=grupo.docente;

    //bloquear campos que no se pueden editar
    this.grupoForm.disable();

    this.abrirModal(content);
  }

  activarEdicionDocente() {
    this.modo = 'editarDocente';
    this.grupoForm.enable(); // primero habilita todo
    this.grupoForm.get('nombre')?.disable();
    this.grupoForm.get('periodo')?.disable();
    this.grupoForm.get('idCurso')?.disable();
  }


  abrirconfirmacion(grupo: any, content: any) {
    this.grupoSeleccionadoId = grupo.idGrupo;
    if(grupo.estado==='HABILITADO'){
      this.accionTexto='desactivar el ' + grupo.nombre
    }else{
      this.accionTexto='activar el ' + grupo.nombre
    }
    const modalRef = this.modalService.open(content, {
      centered: true
    });
    //quita el warning de abrir
    (document.activeElement as HTMLElement)?.blur();
  }

  confirmarDesactivacion(modal: any) {
    this.grupoService.habilitarDeshabilitar(this.grupoSeleccionadoId)
      .subscribe({
        next: () => {
          this.toastr.success('Estado actualizado correctamente');
          this.gruposPaginacion();
          this.cargarConteos();
          modal.close();
        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error al cambiar estado');
        }
      });
  }

  cancelar() {
    this.modo = 'crear';
    this.grupoForm.reset();
    this.grupoForm.enable();
  }

  gruposPaginacion(){
    const filtros = this.filtroFormulario?.value || {};

    this.grupoService.consultaGeneralPage(
      this.page,
      this.size,
      filtros
    ).subscribe(resp => {
      this.grupos = resp.content;
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

  cargarConteos(){
    this.grupoService.getGrupos().subscribe(data => {
      this.totalGrupos = data.length;
      this.gruposActivos = data.filter(g => g.estado === 'HABILITADO').length;
      this.gruposInactivos = data.filter(g => g.estado === 'DESHABILITADO').length;
    });
  }

  //filtros
  buscar() {
    this.gruposPaginacion();
  }

  limpiarFiltros() {
    this.filtroFormulario.reset();
    this.page = 0;
    this.gruposPaginacion();
  }
}

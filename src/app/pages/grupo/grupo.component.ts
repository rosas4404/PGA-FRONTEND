import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { grupoDTOResponse } from '../../models/dto/ResponseDto/grupoDTOResponse';
import { GrupoService } from '../../services/grupo.service';
import { ToastrService } from 'ngx-toastr';
import { grupoDTORequest } from '../../models/dto/RequestDto/grupoDTORequest';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CursoService } from '../../services/curso.service';


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
  editandoDocente : boolean=false;
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

  editMode = false;//false = crear, true=editar
  selectedId!: number;
  mostrarFormulario = false;

  
  
  //fata añadir el servicio de docente y curso NOTA
  constructor(private grupoService: GrupoService, private cursoService: CursoService, private fb:FormBuilder, private toastr:ToastrService, private modalService:NgbModal){}

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
    /*this.docenteService.getDocentesActivos().subscribe({
      next: data => this.docentes = data
    });*/  
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
    this.editMode=false;
    this.grupoForm.reset();

    //habilitar campos
    this.grupoForm.enable();
  }

  guardar(modal: any){
    if(this.grupoForm.invalid)return;

    const formValue: grupoDTORequest=this.grupoForm.value;

    if(this.editMode){
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
    this.editMode = true;
    this.selectedId = grupo.idGrupo!;
    this.editandoDocente=false;//para rfitar al docente

     this.grupoForm.patchValue({
      nombre: grupo.nombre,
      periodo: grupo.periodo,
      idCurso: grupo.idCurso,
      idDocente: grupo.idUsuario
    });

    // Buscar el nombre del docente por id
    const docente = this.docentes.find(d => d.idUsuario === grupo.idUsuario);
    this.docenteSeleccionadoNombre = docente ? docente.nombreCompleto : '';

    //bloquear campos que no se pueden editar
    this.grupoForm.get('nombre')?.disable();
    this.grupoForm.get('periodo')?.disable();
    this.grupoForm.get('idCurso')?.disable();

    this.abrirModal(content);
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
    this.editMode = false;
    this.mostrarFormulario = false;
    this.grupoForm.enable();
    this.grupoForm.reset();
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
  

  siguiente() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.gruposPaginacion();
    }
  }

  anterior() {
    if (this.page > 0) {
      this.page--;
      this.gruposPaginacion();
    }
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
    this.page = 0;
    this.gruposPaginacion();
  }

  limpiarFiltros() {
    this.filtroFormulario.reset();
    this.page = 0;
    this.gruposPaginacion();
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { cursoDTOResponse } from '../../models/dto/ResponseDto/cursoDTOResponse';
import { CursoService } from '../../services/curso.service';
import { ToastrService } from 'ngx-toastr';
import { actividadBaseDTOResponse } from '../../models/dto/ResponseDto/actividadBaseDTOResponse';
import { ActividadBaseService } from '../../services/actividad-base.service';
import { TitleStrategy } from '@angular/router';
import { cursoDTORequest } from '../../models/dto/RequestDto/cursoDTORequest';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './curso.component.html',
  styleUrl: './curso.component.scss'
})
export class CursoComponent implements OnInit{

  cursos: cursoDTOResponse [] = [];
  actividades: actividadBaseDTOResponse [] = [];

  cursoSeleccionado!:cursoDTOResponse;//ayuda a ver los datos
  accionTexto! : string;//ayuda para cambiar el mensaje en el estado

  //conteo de tarjetas
  totalCursos=0;
  cursosActivos=0;
  cursosInactivos=0;

  //paginacion
  totalPages=0;
  page = 0;
  size = 3;

  cursoForm!: FormGroup;
  //FILTRO DINAMICO
  filtroFormulario!: FormGroup;
  totalElements = 0;

  modo: 'crear' | 'ver' | 'editarCurso' = 'crear';

  constructor(private cursoService: CursoService,private actividadService:ActividadBaseService, private fb:FormBuilder, private toastr:ToastrService, private modalService:NgbModal){}

  ngOnInit(): void {
    this.cursoForm=this.fb.group({
      nombre : ['', Validators.required],
      descripcion : ['', Validators.required],
      idActividadesBase: [[], Validators.required],//nota: es un array de numeros
      activo: [null]
    });

    this.filtroFormulario = this.fb.group({
      nombre: [null],
      activo: [null]
    });

    //pendiente
    this.cursosPaginacion();
    this.cargarConteos();
    this.cargarActividadesBase();
  }

  cargarActividadesBase(){
    this.actividadService.getActividadesBaseActivas().subscribe({
      next: data => this.actividades= data
    });
  }

  abrirModal(content: any) {
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  nuevoCurso(){
    this.modo ='crear';
    this.cursoForm.reset();
    //habilitar campos
    this.cursoForm.enable();
  }

  guardar(modal:any){
    if(this.cursoForm.invalid)return;
  
      const formValue: cursoDTORequest=this.cursoForm.value;

        if(this.modo=='editarCurso'){
          this.cursoService.actualizarCurso(this.cursoSeleccionado.idCurso, formValue)
            .subscribe({
              next: () => {
                this.toastr.success('Actualizado correctamente');
                this.cursosPaginacion();
                this.cargarConteos();
                modal.close();
                this.modo = 'crear'; // SOLO cambia modo
              },
              error: (err)=>{
                this.toastr.error(err.error.message || 'Error');
              }
          });
        }else{
          this.cursoService.crearCurso(formValue).subscribe({
            next: () => {
              this.toastr.success('Creado', 'Curso creado correctamente');
              this.cursosPaginacion();
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

  editar(id: number, modal: any){
    this.cursoService.getcurso(id).subscribe(curso => {

      this.cursoSeleccionado = curso;

      const ids = curso.actividades.map(a => a.idActividad);

      this.cursoForm.patchValue({
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        idActividadesBase: ids
      });

      this.modo = 'ver';

      this.cursoForm.disable();

      this.abrirModal(modal);
    });
  }

  activarEdicionCurso(){
    this.modo='editarCurso';
    this.cursoForm.enable();
    this.cursoForm.get('nombre')?.disable();
    //pendiente
  }

  
  abrirconfirmacion(curso: cursoDTOResponse, content: any) {
    this.cursoSeleccionado = curso;
    if(curso.activo===true){
      this.accionTexto='desactivar el ' + curso.nombre
    }else{
      this.accionTexto='activar el ' + curso.nombre
    }
    this.modalService.open(content, {
      centered: true
    });
    //quita el warning de abrir
    (document.activeElement as HTMLElement)?.blur();
  }

  confirmarDesactivacion(modal: any) {
    this.cursoService.habilitarDeshabilitar(this.cursoSeleccionado.idCurso)
      .subscribe({
        next: () => {
          this.toastr.success('Estado actualizado correctamente');
          this.cursosPaginacion();
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
    this.cursoForm.reset();
    this.cursoForm.enable();
  }
  
  cursosPaginacion(){
    const filtros = this.filtroFormulario?.value || {};

    this.cursoService.consultaGeneralPage(
      this.page,
      this.size,
      filtros
    ).subscribe(resp => {
      this.cursos = resp.content;
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
    this.cursoService.getCursos().subscribe(data => {
      this.totalCursos = data.length;
      this.cursosActivos = data.filter(c => c.activo===true).length;
      this.cursosInactivos = data.filter(c => c.activo === false).length;
    });
  }

  //filtros
  buscar() {
    this.cursosPaginacion();
  }

  limpiarFiltros() {
    this.filtroFormulario.reset();
    this.page = 0;
    this.cursosPaginacion();
  }

  //para hacer un checkbox de actividades
  onCheckboxChange(event: any) {
    const idActividad = +event.target.value;

    if (this.modo === 'crear') {
          const selectedIds = this.cursoForm.get('idActividadesBase')?.value || [];

      if (event.target.checked) {
        selectedIds.push(idActividad);
      } else {
        const index = selectedIds.indexOf(idActividad);
        if (index > -1) {
          selectedIds.splice(index, 1);
        }
      }

      this.cursoForm.get('idActividadesBase')?.setValue(selectedIds);
      return;
    }

    if (this.modo === 'editarCurso') {
      if (event.target.checked) {
        this.cursoService.asignarActividadesCurso(
          this.cursoSeleccionado.idCurso,
          { idsActividadesBase: [idActividad] }
        ).subscribe({
          next: () => {
            this.toastr.success('Actividad asignada');
              this.cursoService.getcurso(this.cursoSeleccionado.idCurso)
                .subscribe(curso => {
                  this.cursoSeleccionado = curso;
                });
          },
          error: (err) => {
            this.toastr.error(err.error.message || 'Error al asignar');
            event.target.checked = false; // revertir
          }
        });

      } else {
        this.cursoService.eliminarActividadees(
          this.cursoSeleccionado.idCurso,
          idActividad
        ).subscribe({
          next: () => {
            this.toastr.success('Actividad removida');
              this.cursoService.getcurso(this.cursoSeleccionado.idCurso)
                .subscribe(curso => {
                  this.cursoSeleccionado = curso;
                });
          },
          error: (err) => {
            this.toastr.error(err.error.message || 'Error al quitar');
            event.target.checked = true; // revertir
          }
        });
      }
    }
  }

  estaActividadAsignada(idActividad: number): boolean {
    if (!this.cursoSeleccionado || !this.cursoSeleccionado.actividades) {
      return false;
    }

    return this.cursoSeleccionado.actividades
      .some(a => a.idActividad === idActividad);
  }

  editarModoDirecto(id: number, modal:any){
    this.cursoService.getcurso(id).subscribe(curso => {

      this.cursoSeleccionado = curso;

      const ids = curso.actividades.map(a => a.idActividad);

      this.cursoForm.patchValue({
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        idActividadesBase: ids
      });

      this.modo = 'editarCurso';

      this.cursoForm.enable();
      this.cursoForm.get('nombre')?.disable();

      this.abrirModal(modal);
    });
  }
}

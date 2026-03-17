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

  //modal dinamico
  modalRef: any;
  paso = 1;
  cargando = false;
  idCursoRecienCreado = 0;

  modo: 'crear' | 'ver' | 'editarCurso' = 'crear';

  constructor(private cursoService: CursoService,private actividadService:ActividadBaseService, private fb:FormBuilder, private toastr:ToastrService, private modalService:NgbModal){}

  ngOnInit(): void {
    this.cursoForm=this.fb.group({
      nombre : ['', Validators.required],
      descripcion : ['', Validators.required],
      idActividadesBase: [[]],//nota: es un array de numeros
      activo: [null]
    });

    this.filtroFormulario = this.fb.group({
      nombre: [''],
      activo: ['']
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
      backdrop: 'static',
    keyboard: false,
    centered: true
  });
  this.modalRef.result.finally(() => {
    this.cerrarModal(content);
  });
  }

  nuevoCurso(){
    this.modo = 'crear';
    this.paso = 1;

    this.cursoForm.enable();
    this.cursoForm.reset({
      nombre: '',
      descripcion: '',
      idActividadesBase: []
    });

    this.cursoSeleccionado = {} as cursoDTOResponse;
  }

  guardar(modal:any){
    if(this.cursoForm.invalid)return;

    //paso 1
    if(this.modo==='crear'&& this.paso===1){
      this.paso=2;
      return;
    }
      const formValue: cursoDTORequest=this.cursoForm.value;

      if (!formValue.idActividadesBase) { //para evitar que la lista de actividades llegue nula ppor el checkbox
        formValue.idActividadesBase = [];
      }

      //crear curso - paso 2
      if (this.modo==='crear'&& this.paso===2){
        this.cursoService.crearCurso(formValue).subscribe({
            next: () => {
              this.toastr.success('Creado', 'Curso creado correctamente');
              
              this.cursosPaginacion();
              this.cargarConteos();
              
              this.paso=1;
              this.cancelar();

              modal.close();
            },
            error: (err)=>{
              this.toastr.error(err.error.message || 'err', 'Error al crear');
            }
        });
        return;
      }
      //editar curso
      if(this.modo==='editarCurso'){
        this.cursoService.actualizarCurso(this.cursoSeleccionado.idCurso, formValue)
          .subscribe({
            next: () => {
              this.toastr.success('Actualizado correctamente');
              this.cursosPaginacion();
              this.cargarConteos();
              modal.close();
              },
              error: (err)=>{
                this.toastr.error(err.error.message || 'Error');
              }
          });
    }   
  }

  private cargarCurso(id:number, modo:'ver'|'editarCurso', paso=1){
    this.cursoService.getcurso(id).subscribe(curso => {
      this.cursoSeleccionado = curso;
      const ids = curso.actividades.map(a => a.idActividad);
      this.cursoForm.patchValue({
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        idActividadesBase: ids
      });

      this.modo = modo;
      this.paso = paso;

      if(modo === 'ver'){
        this.cursoForm.disable();
      }else{
        this.cursoForm.enable();
        this.cursoForm.get('nombre')?.disable();
      }

    });
  }

  editar(id: number, modal: any){
    this.abrirModal(modal);
    this.cargarCurso(id, 'ver',1);
  }

  activarEdicionCurso(){
    this.modo='editarCurso';
    this.cursoForm.enable();
    this.cursoForm.get('nombre')?.disable();
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
    this.cursosPaginacion();
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
    this.page=0;
    this.cursosPaginacion();
  }

  limpiarFiltros() {
    this.filtroFormulario.reset({
      nombre: '',
      activo: ''
  });
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

  editarModoDirecto(id: number, modal:any){
    this.abrirModal(modal);
    this.cargarCurso(id,'editarCurso',1);
  }

  omitir(modal:any){
    const formValue: cursoDTORequest = this.cursoForm.value;

    formValue.idActividadesBase = [];

    this.cursoService.crearCurso(formValue).subscribe({
      next:()=>{
        this.toastr.success('Curso creado sin actividades');

        this.cursosPaginacion();
        this.cargarConteos();

        this.cancelar();
        this.paso = 1;

        modal.close();
      }
    });
  }

  editarActividades(id: number, modal: any){
    this.modo='editarCurso';
    this.abrirModal(modal);
    this.cargarCurso(id,'editarCurso',2);
  }

  cerrarModal(modal:any){
    modal.dismiss();
    setTimeout(() => {
        this.paso = 1;
        this.modo = 'crear';

        this.cursoForm.enable();
        this.cursoForm.reset();
      }, 200);
  }

}

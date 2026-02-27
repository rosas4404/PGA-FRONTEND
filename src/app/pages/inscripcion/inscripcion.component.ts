import { Component, OnInit } from '@angular/core';
import { InscripcionResponseDTO } from '../../models/dto/inscripcionResponseDTO';
import { Tipo } from '../../models/dto/tipo';
import { InscripcionService } from '../../services/inscripcion.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, MinValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { InscripcionFiltro } from '../../models/filtros/inscripcionFiltro';
import { crearInscripcionDTO } from '../../models/dto/crearInscripcionDTO';
import { asignarGrupoDTO } from '../../models/asignarGrupoDTO';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inscripcion.component.html',
  styleUrl: './inscripcion.component.scss'
})
export class InscripcionComponent implements OnInit{
  //modal dinamico
  paso=1
  cargando = false;
  asignarGrupoData: asignarGrupoDTO = {
    idAlumno : 0,
    idGrupo : 0
  }

  page = 0;
  size = 6;
  totalPages = 0;
  totalElements = 0;

  inscripciones : InscripcionResponseDTO[] =[];

  filtroForm!: FormGroup;
  crearForm!: FormGroup
  
  crearInscripcion: crearInscripcionDTO = {
    fechaInicio: "",
    fechaFin: "",
    escuela: "",
    nivelEstudio: "",
    carrera: "",
    tipo: null,
    idUsuario: 0
  } 

  grupos: any[] = [1,2,3,4,5,6,7,8];

  tipos = [ { value: 'Servicio_Social', label: 'Servicio Social' },
            { value: 'Practicas_Profesionales', label: 'Prácticas Profesionales' },
            { value: 'Jovenes_Construyendo_El_Futuro', label: 'Jóvenes Construyendo el Futuro' }
          ];
  
  nivelEstudio = [ { value: 'MEDIO SUPERIOR', label: 'MEDIO SUPERIOR' },
                   { value: 'LICENCIATURA', label: 'LICENCIATURA' },
                   { value: 'POST GRADO', label: 'POST GRAD0' }
                 ];

  filtros : InscripcionFiltro ={
            alumno: null,
            idGrupo : null,
            estado : null,
            tipo : null
  };
constructor( private inscripcionService: InscripcionService, private route: ActivatedRoute, private fb:FormBuilder, private toastr : ToastrService){}

ngOnInit(): void {
  this.crearForm = this.fb.group({
    fechaInicio: ["",Validators.required],
    fechaFin: ["",Validators.required ] ,
    escuela: ["",Validators.required ],
    nivelEstudio: ["",Validators.required ],
    carrera: ["",Validators.required ],
    tipo: ["",Validators.required ],
    idUsuario: ["",Validators.required ]
  },{
    Validators:[this.validatorFechaFin]
  });

  this.filtroForm = this.fb.group({
  alumno: [''],
  idGrupo: [''],
  tipo:['']
  });

  this.cargarInscripciones();
}
cargarInscripciones(){
  const filtros: InscripcionFiltro = {
    alumno: this.filtroForm.value.alumno || null,
    idGrupo: this.filtroForm.value.idGrupo || null,
    estado: null,
    tipo: this.filtroForm.value.tipo || null,
  };
  this.inscripcionService.obtenerInscripciones(this.page,this.size,filtros).subscribe(
  data => {
      this.inscripciones = data.content;
      this.totalPages = data.totalPages;
      this.totalElements = data.totalElements;
  })
  
}
buscar(){
  this.cargarInscripciones();
}

limpiarFiltros(){
  this.filtroForm.reset();
  this.page=0;
  this.cargarInscripciones();
}
get paginas(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i);
}

cambiarPagina(nuevaPagina: number) {
  if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
  this.page = nuevaPagina;
  this.buscar();
}

crear(){
  if(this.crearForm.invalid) return;
  this.cargando = true;
  if (this.crearForm.value.fechaInicio) {
    const partes = this.crearForm.value.fechaInicio.split('-'); 
    this.crearForm.value.fechaInicio = partes[2] + '/' + partes[1] + '/' + partes[0];
  }
  if (this.crearForm.value.fechaFin) {
    const partes = this.crearForm.value.fechaFin.split('-'); 
    this.crearForm.value.fechaFin = partes[2] + '/' + partes[1] + '/' + partes[0];
  }
  
  this.crearInscripcion ={
   
    fechaInicio: this.crearForm.value.fechaInicio,
    fechaFin: this.crearForm.value.fechaFin,
    escuela: this.crearForm.value.escuela,
    nivelEstudio: this.crearForm.value.nivelEstudio,
    carrera: this.crearForm.value.carrera,
    tipo: this.crearForm.value.tipo,
    idUsuario: this.crearForm.value.idUsuario
  } 

  this.inscripcionService.crear(this.crearInscripcion).subscribe({
    next:(data)=>{
      this.cargando = false;
      this.toastr.success ('Inscripción creada correctamente');
      this.asignarGrupoData.idAlumno = data.idInscripcion;
      this.paso = 2;
    },
    error: (err)=> () =>{
      this.cargando = false;
      this.toastr.error ('Error al crear inscripción')
    }
  });
}

validatorFechaFin(form:AbstractControl){
const fechaInicio = form.get('fechaInicio')?.value;
if (!fechaInicio) return null;
const fechaFin = form.get('fechaFin')?.value;
if (!fechaFin) return null;

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  return fin > inicio 
    ? { fechaFinFutura: true }
    : null;
}

asignarGrupo(){
if (!this.asignarGrupoData.idGrupo) return;
  this.inscripcionService.asignar(this.asignarGrupoData
    ).subscribe({
      next: () => {
        this.toastr.success('Grupo asignado correctamente');
        this.cerrarModal();
        this.resetear();
      },
      error: () => {
        this.toastr.error('No se pudo asignar el grupo');
    }
  });
}


ommitir(){
  this.toastr.info('Inscripción creada sin grupo');
  this.cerrarModal();
  this.resetear();
}
resetear() {
  this.paso = 1;
  this.crearForm.reset();
  this.asignarGrupoData.idGrupo = null;
  this.asignarGrupoData.idAlumno = null;
}
cerrarModal() {
  document.getElementById('btnCerrarModal')?.click();
}


}







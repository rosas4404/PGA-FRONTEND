import { booleanAttribute, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ActividadGrupoService } from '../../../services/actividad-grupo.service';
import { actividadGrupoDTOResponse } from '../../../models/dto/ResponseDto/actividadGrupoDTOResponse';
import { CampoAgrupadoDTO } from '../../../models/dto/ResponseDto/campoAgrupadoDTO';
import { CommonModule } from '@angular/common';
import { NgbAccordionCollapse, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActividadBaseService } from '../../../services/actividad-base.service';
import { actividadBaseDTOResponse } from '../../../models/dto/ResponseDto/actividadBaseDTOResponse';
import { ToastrService } from 'ngx-toastr';
import { InscripcionService } from '../../../services/inscripcion.service';
import { alumnoGrupoDTOResponse } from '../../../models/dto/ResponseDto/alumnoGrupoDTOResponse';
import { asignarActividadExtraDto } from '../../../models/dto/RequestDto/asignarActividadExtraDto';
import { AsignarActividadCatalogoDto } from '../../../models/dto/RequestDto/asignarActividadCatalogoDto';

@Component({
  selector: 'app-actividades-grupo',
  standalone: true,
  imports: [CommonModule, NgbAccordionCollapse, FormsModule, ReactiveFormsModule,],
  templateUrl: './actividades-grupo.component.html',
  styleUrl: './actividades-grupo.component.scss'
})
export class ActividadesGrupoComponent implements OnInit {
  idGrupo : number = 0;

  actividades : actividadGrupoDTOResponse[] = [];
  gruposCampos: CampoAgrupadoDTO[] = [];
  gruposCamposFiltrados : CampoAgrupadoDTO[] = [];

  registroExtraForm! : FormGroup;

  paso = 1;

  modo: 'catalogo' | 'extra' = 'catalogo';
  esIndividual =  false;

  disponibles : actividadBaseDTOResponse[] = [];
  actividadesBase : actividadBaseDTOResponse[] = [];
  actividadBaseSeleccionada : actividadBaseDTOResponse | null = null;
  
  dropdownAbierto : boolean = false;
  setInstrucciones = false;
  setEntrega = false;
  archivoSeleccionado : File | null = null;
  alumnos : alumnoGrupoDTOResponse [] =[];
  idInscripciones : number[] =[];
  
  constructor(
    private route : ActivatedRoute, 
    private actividadesGrupoService : ActividadGrupoService,
    private actividadesBaseService : ActividadBaseService,
    private router : Router,
    private fb : FormBuilder, 
    private modalService : NgbModal,
    private toastr : ToastrService,
    private inscripcionService : InscripcionService
    
  ){}
  ngOnInit(): void {
      this.idGrupo =  Number(this.route.parent?.parent?.snapshot.paramMap.get('idGrupo'));
      this.cargarActividadesGrupo();

      this.registroExtraForm = this.fb.group({
        titulo : ["", Validators.required],
        descripcion : ["", Validators.required]
      });
  }

  cargarActividadesGrupo(){
    this.actividadesGrupoService.obtenerActividadesGrupales(this.idGrupo).subscribe({
      next : (data) => {
        this.actividades = data;
         this.gruposCampos = this.agruparPorCampo(this.actividades);
         this.gruposCamposFiltrados = this.gruposCampos; 
      }
    });
  }

  

  agruparPorCampo(actividades: actividadGrupoDTOResponse[]) : CampoAgrupadoDTO[] {
  const grupoCampos: {[campo : string] : actividadGrupoDTOResponse[]} = {};

  actividades.forEach(act => {
    const campo = act.campo || 'Sin campo';
    if (!grupoCampos[campo]) {
      grupoCampos[campo] = [];
    }
    grupoCampos[campo].push(act);
  });

  return Object.keys(grupoCampos).map(nombreCampo => ({
    nombre: nombreCampo,
    actividades: grupoCampos[nombreCampo]
  }));
}

verActividad(act: actividadGrupoDTOResponse) {
  this.router.navigate([ act.idActividadGrupo], {
    relativeTo: this.route
  });
}


abrirModalCrear(content : any){

  this.actividadBaseSeleccionada = null; 
  this.cargarActividadesCatalogodisponibles();
  this.cargarAlumnosporGrupo();
  this.registroExtraForm.reset();
  this.paso = 1;
  this.modo = "catalogo";
  this.archivoSeleccionado = null;
  this.setInstrucciones = false;
  this.setEntrega = false;
  this.idInscripciones = [];
  this.esIndividual = false;
  
  const modalRef =  this.modalService.open(content, {
    centered: true,
    backdrop: 'static',
    keyboard: false
  });
   modalRef.result.finally(() => {
      modalRef.close();
    });
}


cargarActividadesCatalogodisponibles(){
  
  this.actividadesBaseService.getActividadesBaseActivas().subscribe({
    next : (Data) =>{
      this.disponibles = Data.filter(actividad =>
        !this.actividades.some(a => a.titulo == actividad.titulo)
      );
      console.log(this.disponibles);

    }
  });
}
cargarAlumnosporGrupo(){
  this.alumnos = [];
    this.inscripcionService.obtenerAlumnosPorGrupo(this.idGrupo).subscribe({
      next: (data) => this.alumnos = data,
      error: () => this.alumnos = []
    });
}
cambiarModo(nuevoModo: 'catalogo' | 'extra') {
  this.actividadBaseSeleccionada = null;
  this.registroExtraForm.reset();

  this.modo = nuevoModo;
  if(this. modo === 'catalogo'){
    this.setInstrucciones = false;
  }

  if(this.modo === 'extra'){
    this.setInstrucciones = true;
  }
}
toggleDropdown() {
  this.dropdownAbierto = !this.dropdownAbierto;
}

seleccionarActividad(actividad: any) {
  this.actividadBaseSeleccionada = actividad;
  this.dropdownAbierto = false;
}
onFileSelected(event: any){
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
  } else {
    this.toastr.warning('No se seleccionó ningún archivo');
  }
  event.target.value = '';
}
regresar(){
 if( this.paso == 3){
  this.idInscripciones = [];
  this.esIndividual = false;
  this.paso = 2;
 }
 else{
  this.archivoSeleccionado = null;
 this.setInstrucciones = this.modo == 'catalogo' ?  false : true;
  this.setEntrega = false
  this.paso =1
 } 
}

seleccionAlumno( id: number, event : any){
  if (event.target.checked) {
    this.idInscripciones.push(id);
  } else {
    this.idInscripciones = this.idInscripciones
      .filter(id => id !== id);
  }
}

guardar(modal : any){
  if(this.modo === 'catalogo'){
    const dto : AsignarActividadCatalogoDto ={
      idActividadBase : this.actividadBaseSeleccionada?.idActividad || 0,
      reqEntrega :  this.setEntrega,
      alcance : this.esIndividual == true ? 'INDIVIDUAL' : 'GRUPAL',
      idInscripciones : this.idInscripciones
    };

    this.actividadesGrupoService.agregarDesdeCatalogo(this.idGrupo, dto, this.archivoSeleccionado).subscribe({
      next : (data) => {
        this.toastr.success('Actividad registrada con éxito', 'Exito');
        this.cargarActividadesGrupo();
        modal.close();
      },
      error : (err) => {
        this.toastr.error(err.error?.message || 'Error al hacer el registro', 'Error')
      }
    });
  }else{
      const dto : asignarActividadExtraDto={
      titulo : this.registroExtraForm.value.titulo,
      descripcion : this.registroExtraForm.value.descripcion,
      reqEntrega :  this.setEntrega,
      alcance : this.esIndividual == true ? 'INDIVIDUAL' : 'GRUPAL',
      idInscripciones : this.idInscripciones
    };

    this.actividadesGrupoService.agregarextra (this.idGrupo, dto, this.archivoSeleccionado).subscribe({
      next : (data) => {
        this.toastr.success('Actividad registrada con éxito', 'Exito');
        this.cargarActividadesGrupo();
        modal.close();
      },
      error : (err) => {
        this.toastr.error(err.error?.message || 'Error al hacer el registro', 'Error')
      }
    });

  }
}

}

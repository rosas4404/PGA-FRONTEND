import { Component, OnInit } from '@angular/core';
import { actividadAlumnoDTO } from '../../../models/dto/ResponseDto/actividadalumnoDTO';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadAlumnoService } from '../../../services/actividad-alumno.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { ActividadGrupoService } from '../../../services/actividad-grupo.service';

@Component({
  selector: 'app-actividad-alumno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actividad-alumno.component.html',
  styleUrl: './actividad-alumno.component.scss'
})
export class ActividadAlumnoComponent implements OnInit {
  idActividadAlumno! : number;
  idInscripcion! : number;
  actividad! :actividadAlumnoDTO;

  urlActividad:any; //ver el docuemento en el modal

  selectedFile!:File; //para el archivo

  idActividadSeleccionado!:number;//servira para enviar y ver el archivo

  constructor(private route : ActivatedRoute, private actividadAlumnoService : ActividadAlumnoService, private router : Router, 
    private modalService : NgbModal, private toastr: ToastrService, private sanitizar: DomSanitizer, private actividadGrupoService: ActividadGrupoService ){}

  ngOnInit(): void {
    this.idActividadAlumno =  Number(this.route.snapshot.paramMap.get('idActividadAlumno'));
    this.idInscripcion =  Number(this.route.snapshot.paramMap.get('idInscripcion'));

    this.cargarActividad();

  }

  cargarActividad(){
    this.actividadAlumnoService.obtenerActividadPorInscripcion(this.idInscripcion, this.idActividadAlumno).subscribe({
      next: (data) =>{
        this.actividad = data;
      }
    })
  }

  volver(){
    this.router.navigate(['alumno-dashboard/panel-grupo-alumno/actividades-alumno']); //navegacion relativa para entrar al hijo
  }

onFileSelected(event:any){//se ejecuta cuando el usuario seleccioa un archivo en el input file
    const archivo: File = event.target.files[0]; // Obtenemos el primer archivo seleccionado
    const maxSize = 2 * 1024 * 1024; // 2MB (2 * 1024 KB * 1024 B)
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
    //validacion de que no exceda el peso 
    if (!archivo) return; //si no hay archivo sale
    // Validar Tipo (Formato)
    if (!tiposPermitidos.includes(archivo.type)) {
      this.toastr.error('Error: Solo se permiten archivos PDF, JPG o PNG.');
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
      this.subir(archivo);
    } else {
      // Si canceló la selección sin elegir nada
      this.toastr.warning('No se seleccionó ningún archivo');
    }

    // Limpiar el input para permitir re-seleccionar el mismo archivo si es necesario
    event.target.value = '';//si no se limpia, el navegador no dispara el evento change otra vez
  }

  subir(archivo:File){
      // Usamos this.idAlumno (del @Input), el tipo del documento y el archivo
    this.actividadAlumnoService.subirDocumento(this.idActividadAlumno, archivo).subscribe({
      next: (data) => {//si responde bien el back
        this.toastr.success('Actividad subida correctamente');
        this.cargarActividad();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al subir el archivo');
      }
    });
  }

  visualizar(idActividadAlumno:number, modal:any, rutaDocumento:string){
    console.log(idActividadAlumno)
    console.log(this.idActividadAlumno)
    if (!rutaDocumento) {
      this.toastr.error('No se ha subido un archivo');
      return;
    }
    const extension =   rutaDocumento.split('.').pop()?.toLowerCase();
  
    const mapeoTipos: { [key: string]: string } = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'png': 'image/png'
    };

    this.actividadAlumnoService.visualizarDocumento(idActividadAlumno).subscribe({
      next:(blob) => {//recibe el archivo como blob
            const tipoReal = mapeoTipos[extension!]||'appliction/octet-stream';
            const file = new Blob([blob], { type: tipoReal }); //crea un nuevo blob especifiando que es un pdf
            const url = window.URL.createObjectURL(file);//crea una url temporal del archivo
            
            this.urlActividad=this.sanitizar.bypassSecurityTrustResourceUrl(url);
            this.idActividadSeleccionado = idActividadAlumno;
            //abrir en el modal
            this.modalService.open(modal,{
              size:'xl',
              centered:true,
              backdrop:'static'
            });
            }, 
            error: async (err) => {
              if (err.error instanceof Blob) {//si el back devuelve un error como blob
                // Convertir el Blob del error a texto legible
              try {
                  const text = await err.error.text();
                  const errorObj = JSON.parse(text);
                  this.toastr.error(errorObj.message || 'Error al visualizar');
                } catch {
                  this.toastr.error('Error al procesar el archivo');
                }
              } else {
                this.toastr.error(err.error?.message || 'Error de conexión');
              }
            }
      }
    );
  }

  abrirInstrucciones(id : number) {
 
  this.actividadGrupoService.verInstrucciones(id).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    error: (err) => {
      console.error(err);
    }
  });
}

}

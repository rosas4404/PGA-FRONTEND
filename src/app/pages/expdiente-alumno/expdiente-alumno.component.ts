import { Component, OnInit } from '@angular/core';
import { ExpedienteService } from '../../services/expediente.service';
import { DocumentoExpedienteService } from '../../services/documento-expediente.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { usuarioDTOResponse } from '../../models/dto/ResponseDto/usuarioDTOResponse';
import { estadoExpediente } from '../../models/enum/estadoExpediente';
import { expedienteDTOResponse } from '../../models/dto/ResponseDto/expedienteDTOResponse';
import { estadoDocumento } from '../../models/enum/estadoDocumento';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-expdiente-alumno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './expdiente-alumno.component.html',
  styleUrl: './expdiente-alumno.component.scss'
})
export class ExpdienteAlumnoComponent implements OnInit{

  idUsuario!:number;
  usuario: usuarioDTOResponse = {} as usuarioDTOResponse;

  expedienteSeleccionado?: expedienteDTOResponse = {
      idExpediente: 0,
      idAlumno:0,
      estado: estadoExpediente.APROBADO,
      observaciones: '',
      documentos: []
    }; //para ver la infor
  
    urlDocumento:any; //ver el docuemento en el modal

    selectedFile!:File; //para el archivo

    idDocumentoSeleccionado!:number;//servira para enviar y ver el archivo

  constructor(private expedienteService : ExpedienteService, private documentoExpedienteService: DocumentoExpedienteService, private fb:FormBuilder, private usuarioService: UsuarioService,
     private toastr:ToastrService, private modalService:NgbModal, private sanitizar: DomSanitizer){}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;

    this.cargarExpediente();
    this.cargarUsuario();  
  }
 
  cargarExpediente(){
    this.expedienteService.obtenerExpedienteporAlumno(this.idUsuario)
      .subscribe(resp=>{
        console.log(resp);
        this.expedienteSeleccionado = resp;
      });
  }

  cargarUsuario(){
    this.usuarioService.obtenerUsuarioId(this.idUsuario).subscribe({
      next:(data)=>{
        this.usuario=data;
        console.log(this.usuario);
      }
    });
  }

    //permite ver el contenido o enviarlo 
  onFileSelected(event:any, tipoDocumento:string){//se ejecuta cuando el usuario seleccioa un archivo en el input file
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
      this.subir(tipoDocumento, archivo);
    } else {
      // Si canceló la selección sin elegir nada
      this.toastr.warning('No se seleccionó ningún archivo');
    }

    // Limpiar el input para permitir re-seleccionar el mismo archivo si es necesario
    event.target.value = '';//si no se limpia, el navegador no dispara el evento change otra vez
  }

  subir(tipoDocumento:string, archivo:File){
      // Usamos this.idAlumno (del @Input), el tipo del documento y el archivo
    this.documentoExpedienteService.subirDocumento(this.idUsuario, tipoDocumento, archivo).subscribe({
      next: (data) => {//si responde bien el back
        this.toastr.success('Documento subido correctamente');
        this.cargarExpediente();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al subir el archivo');
      }
    });
  }

  visualizar(idDocumento:number, modal:any, rutaDocumento:string){
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

    this.documentoExpedienteService.visualizarDocumento(idDocumento).subscribe({
      next:(blob) => {//recibe el archivo como blob
            const tipoReal = mapeoTipos[extension!]||'appliction/octet-stream';
            const file = new Blob([blob], { type: tipoReal }); //crea un nuevo blob especifiando que es un pdf
            const url = window.URL.createObjectURL(file);//crea una url temporal del archivo
            
            this.urlDocumento=this.sanitizar.bypassSecurityTrustResourceUrl(url);
            this.idDocumentoSeleccionado = idDocumento;
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

  getBadgeClass(estado: estadoDocumento | undefined):any {
      if (estado === undefined || estado === null) {
        return 'bg-secondary'; // Color gris por defecto
      }
        const e = estado.toString().toUpperCase();
        if (e === 'APROBADO' || estado === estadoDocumento.APROBADO) {
          return 'bg-success'; // Verde
        }
        
        if (e === 'PENDIENTE' || estado === estadoDocumento.PENDIENTE) {
          return 'bg-warning text-dark'; // Amarillo
        }
        
        if (e === 'RECHAZADO' || estado === estadoDocumento.RECHAZADO) {
          return 'bg-danger'; // Rojo
        }
        
        return 'bg-secondary';
      }

}

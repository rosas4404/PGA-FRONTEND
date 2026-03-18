import { Component, Input, OnInit } from '@angular/core';
import { ExpedienteService } from '../../services/expediente.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { expedienteDTOResponse } from '../../models/dto/ResponseDto/expedienteDTOResponse';
import { DocumentoExpedienteService } from '../../services/documento-expediente.service';
import { DomSanitizer } from '@angular/platform-browser';
import { docuemntoRevisionDTORequest } from '../../models/dto/RequestDto/documentoRevisonDTORequest';
import { TitleStrategy } from '@angular/router';
import { observacionesExpedienteDTORequest } from '../../models/dto/RequestDto/observacionesExpedienteDTORequest';
import { estadoExpediente } from '../../models/enum/estadoExpediente';
import { estadoDocumento } from '../../models/enum/estadoDocumento';

type estado = 'APROBADO' |'NO_APROBADO';
@Component({
  selector: 'app-expediente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './expediente.component.html',
  styleUrl: './expediente.component.scss'
})
export class ExpedienteComponent implements OnInit {

  expedienteForm!: FormGroup; //observaciones generales 
  documentoExpedienteForm!: FormGroup;//observaciones del documento y el estado del documento

  expedienteSeleccionado?: expedienteDTOResponse = {
    idExpediente: 0,
    idAlumno:0,
    estado: estadoExpediente.APROBADO,
    observaciones: '',
    documentos: []
  }; //para ver la infor

  urlDocumento:any; //ver el docuemento en el modal
  idDocumentoSeleccionado!:number;//servira para la revision

  @Input() idAlumno!: number;//traer el id del usuario por el padre

  selectedFile!:File; //para el archivo

  estadoDocumento = [{value: 'RECHAZADO', label:'RECHAZADO'},{value:'APROBADO', label:'APROBADO'}];
  estado : estado | undefined;

  //modal dinamico
  modalRef:any;
  paso=1;
  cargando = false;

  constructor(private expedienteService : ExpedienteService, private documentoExpedienteService: DocumentoExpedienteService, private fb:FormBuilder, 
    private toastr:ToastrService, private modalService:NgbModal, private sanitizar: DomSanitizer){}

  ngOnInit(): void {
    this.expedienteForm=this.fb.group({
      observacion: ['', [Validators.maxLength(250)]]
    });

    this.documentoExpedienteForm=this.fb.group({
      observacion: ['', [Validators.maxLength(250)]],
      estadoDocumento:['', Validators.required]
    });

    this.cargarExpediente();
  }

  cargarExpediente(){
    this.expedienteService.obtenerExpedienteporAlumno(this.idAlumno)
      .subscribe(resp=>{
        console.log(resp);
        this.expedienteSeleccionado = resp;
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
    this.documentoExpedienteService.subirDocumento(this.idAlumno, tipoDocumento, archivo).subscribe({
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
    this.documentoExpedienteForm.reset();
    this.paso=1;
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
            this.paso=1;
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

  revisar(idDocumento:number, modal:any){
    if(this.documentoExpedienteForm.invalid)return;

    const formValue: docuemntoRevisionDTORequest=this.documentoExpedienteForm.value;

    this.documentoExpedienteService.revisarDocumentos(idDocumento, formValue).subscribe({
      next:()=>{
        this.toastr.success('Estado actualizado correctamente');
        this.cargarExpediente();
        this.documentoExpedienteForm.reset();
        modal.close();
      },
      error:(err)=>{
        this.toastr.error(err.error.menssage||'Error');
      }
    })
  }

  observacion(idExpediente:number, modal:any){
    if(this.expedienteForm.invalid)return;

    const formValue: observacionesExpedienteDTORequest=this.expedienteForm.value;

    this.expedienteService.observaciones(idExpediente, formValue).subscribe({
      next:()=>{
        this.toastr.success('Estado actualizado correctamente');
        this.cargarExpediente();
        this.expedienteForm.reset();
        modal.close();
      },
      error:(err)=>{
        this.toastr.error(err.error.menssage||'Error');
      }
    })
  }

  abrirModalObservacion(modal:any){
    this.modalService.open(modal,{
      centered:true
    });
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

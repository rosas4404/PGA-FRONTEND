import { Component, OnInit } from '@angular/core';
import { grupoDTODashboardResponse } from '../../../models/dto/ResponseDto/grupoDTODashboardResponse';
import { alumnoGrupoDTOResponse } from '../../../models/dto/ResponseDto/alumnoGrupoDTOResponse';
import { GrupoService } from '../../../services/grupo.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { InscripcionResponseDTO } from '../../../models/dto/ResponseDto/inscripcionResponseDTO';
import { UsuarioService } from '../../../services/usuario.service';
import { usuarioDTOResponse } from '../../../models/dto/ResponseDto/usuarioDTOResponse';

@Component({
  selector: 'app-alumnos-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './alumnos-grupo.component.html',
  styleUrl: './alumnos-grupo.component.scss'
})
export class AlumnosGrupoComponent implements OnInit{

  idUsuario!:number;
  idGrupo : number = 0;
  grupos: grupoDTODashboardResponse[] = [];
  alumnos: alumnoGrupoDTOResponse[] = []; // se cargan alumnos
  idInscripcion!: number;
  inscripcion!: InscripcionResponseDTO;
  usuario!: usuarioDTOResponse;

  modalRef:any;

  constructor (private grupoService: GrupoService, private usuarioService: UsuarioService , private inscripcionService:InscripcionService, private route : ActivatedRoute, private fb: FormBuilder, private toastr: ToastrService, private modalService: NgbModal){}

  ngOnInit(): void {
    this.idGrupo =  Number(this.route.parent?.snapshot.paramMap.get('idGrupo'));
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;
    
    this.cargarAlumnosPorGrupo(this.idGrupo);
  }

  cargarAlumnosPorGrupo(idGrupo: number) {
    this.alumnos = [];
    this.inscripcionService.obtenerAlumnosPorGrupoGeneral(idGrupo).subscribe({
      next: (data) => this.alumnos = data,
      error: () => this.alumnos = []
    });
  }

  verDatos(idInscripcion: number, modal:any){
    this.inscripcionService.consultaPorId(idInscripcion).subscribe({
      next: (data) =>{
        this.inscripcion = data;
        this.verUsuario(data.idUsuario);
        this.abrirModal(modal);
      }
    });
  }


  verUsuario(idUsuario: number){
    this.usuarioService.obtenerUsuarioId(idUsuario).subscribe({
      next: (data) =>{
        this.usuario = data;
      }
    });
  }

  abrirModal(content: any) {
    this.modalRef  = this.modalService.open(content, {
      size:'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    this.modalRef.result.finally(() => {
      this.cerrarModal(content);
    });
  }  

   cerrarModal(modal:any){
    modal.dismiss();
  }

  get alumnosInscritos() {
    return this.alumnos.filter(a => a.estado);
  }

  get alumnosDesvinculados() {
    return this.alumnos.filter(a => !a.estado);
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { usuarioDTOResponse } from '../../models/dto/ResponseDto/usuarioDTOResponse';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router} from "@angular/router";
import { ExpedienteComponent } from "../expediente/expediente.component";

@Component({
  selector: 'app-consulta-revision',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule, ExpedienteComponent],
  templateUrl: './consulta-revision.component.html',
  styleUrl: './consulta-revision.component.scss'
})
export class ConsultaRevisonComponent implements OnInit {

  alumnos:usuarioDTOResponse[]=[];

  alumnoSeleccionado!: usuarioDTOResponse;

  filtroForm!: FormGroup;
  registroForm!: FormGroup;

  idUsuario!: number;
  verDetalle=false;
  
  //paginación
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;
  
  constructor(private usuarioService: UsuarioService, private fb:FormBuilder, private toastr:ToastrService, private modalService:NgbModal, private route:ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idUsuario');
    if(id){
      this.idUsuario = Number(id);
      this.verDetalle=true;
      this.usuarioService.obtenerUsuarioId(this.idUsuario).subscribe({
        next:(data)=>{
          this.alumnoSeleccionado=data;
        }
      });
    }
      this.filtroForm = this.fb.group({
        nombre : [null],
        estado : [null]
      })

    this.cargarAlumnos();
  }


  cargarAlumnos(){
    const filtros = {
      nombre: this.filtroForm.value.nombre|| null,
      estado: this.filtroForm.value.estado|| null,  
    };
    this.usuarioService.obtenerAlumnos(this.page,this.size,filtros).subscribe(
    data => {
      this.alumnos = data.content;
      this.totalPages = data.totalPages;
      this.totalElements = data.totalElements;
    });
  }

  buscar(){
    this.cargarAlumnos();
  }

  limpiarFiltros(){
    this.filtroForm.reset();
    this.page=0;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
    this.page = nuevaPagina;
    this.buscar();
  }

  verExpediente(alumno: any){
    console.log(alumno);
    console.log(alumno.idUsuario);
    this.router.navigate(['/admin-dashboard/consulta-revision', alumno.idUsuario])
      .then(() => {
        console.log("Nueva URL:", this.router.url);
      });
  }

  regresar(){
    this.router.navigate(['/admin-dashboard/consulta-revision']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadGrupoService } from '../../../services/actividad-grupo.service';
import { actividadGrupoDashboardDTO } from '../../../models/dto/ResponseDto/actividadGrupoDashboardDTO';
import { CommonModule } from '@angular/common';
import { ActividadAlumnoService } from '../../../services/actividad-alumno.service';
import { actividadAlumnoDTOResponse } from '../../../models/dto/ResponseDto/actividadAlumnoDTOResponse';


@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.scss'
})
export class ActividadComponent implements OnInit {
  idActividad = 0;
  actividad!:  actividadGrupoDashboardDTO
  asignaciones : actividadAlumnoDTOResponse [] = []
  constructor(
    private route : ActivatedRoute, 
    private actividadesGrupoService : ActividadGrupoService,
    private actividadAlumnoService : ActividadAlumnoService,
    private router : Router
  ){}

  ngOnInit(): void {
     this.idActividad =  Number(this.route.snapshot.paramMap.get('idActividad'));
     this.cargarActividad();
     this.cargarAsignaciones();
  }

  cargarActividad(){
    this.actividadesGrupoService.obtenerActividadPorId(this.idActividad).subscribe({
      next: (data) =>
      {
        this.actividad = data;
        console.log(this.actividad);
      }
    })
  }

  cargarAsignaciones(){
    this.actividadAlumnoService.obtenerAsignaciones(this.idActividad).subscribe({
      next : (data) =>{
        this.asignaciones = data;
        console.log(this.asignaciones)
      }
    })
  }
}
